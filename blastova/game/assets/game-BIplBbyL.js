import Phaser from 'phaser';
import * as THREE from 'three';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import {
  commanderXpForLevel,
  createBoardScalers,
  getWeaponBuildCost,
  getWeaponTrayCardLabel,
  getWeaponTrayLabel,
} from './systems/game-core-utils';
import {
  countClearedByTier as countCommanderClearedByTier,
  earnCommanderXP as earnCommanderXPProgress,
  getCommanderDisplayName as getCommanderDisplayNameFromStorage,
  isWorldUnlocked as isCommanderWorldUnlocked,
  loadCommanderLeaderboard as loadCommanderLeaderboardFromStorage,
  loadCommanderData as loadCommanderDataFromStorage,
  recordCommanderLeaderboardEntry as recordCommanderLeaderboardEntryFromStorage,
  recordWorldCleared as recordCommanderWorldCleared,
  saveCommanderData as saveCommanderDataToStorage,
} from './systems/commander-progress-system';
import {
  WEAPON_SHOT_AUDIO_ASSETS,
  WORLD_ONE_ATMOSPHERE_BY_WAVE,
  WORLDS,
} from './systems/game-static-data';
import {
  CUSTOM_BRANCH_PATHS,
  DEFAULT_LAYOUT_GAMEPLAY_RULES,
  DEFAULT_FORTRESS_SLOT_CELLS,
  FORTRESS_LAYOUT_TEMPLATES,
  LASER_BEAM_TEXTURE_KEY_SETS,
  LAYOUT_ALLOWED_BUILD_POLYGONS,
  LAYOUT_GAMEPLAY_RULES,
  LAYOUT_NO_BUILD_POLYGONS,
  PATH_LAYOUT_TEMPLATES,
  WEAPON_BEAM_TINT_MAP,
} from './systems/game-layout-data';
import {
  BASE_HEIGHT,
  BASE_WIDTH,
  BLUEPRINT_AOE_UI_DIVISOR,
  BLUEPRINT_RANGE_UI_FACTOR,
  BLUEPRINT_RUNTIME_STATE_SESSION_FALLBACK_KEY,
  BLUEPRINT_RUNTIME_STATE_STORAGE_KEY,
  BOARD_HEIGHT,
  BOARD_WIDTH,
  BUILD_COST,
  COMMANDER_XP_PER_CLEAR,
  COMMANDER_XP_PER_KILL,
  COMMANDER_XP_PER_WAVE,
  DEBUG_FLAGS,
  DEFAULT_WEAPON_BUILD_COST,
  DIFFICULTY_CONFIGS,
  DOWNLOADED_WORLD_MAP_COUNT,
  ENEMY_BASE_SPEED,
  ENEMY_FIRE_RANGE,
  ENEMY_FIRE_RATE,
  ENEMY_PROJECTILE_SPEED,
  FREE_PLACEMENT_ALL_WAVES,
  FORTRESS_GRID_SIZE,
  GAMEPLAY_VISUAL_SCALE,
  MASTER_AUDIO_ATTENUATION,
  SPECIAL_KILL_GOLD_MULTIPLIERS,
  SUPPLIES_DROP_RULES,
  SUPPLIES_MAX_STASH,
  TERRAIN_ROW_LEVELS,
  TERRAIN_TILE_SIZE,
  THEME_BY_TERRAIN_ROW,
  TOWER_FIRE_RATE,
  TOWER_BASE_VISUAL_SCALE_MULT,
  TOWER_MAG_SIZE,
  TOWER_MAX_HEALTH,
  TOWER_RANGE,
  TOWER_RELOAD_TIME,
  WAVES_PER_PLAYER_LEVEL,
  WEAPON_POWER_TIER_BANDS,
} from './systems/game-config-constants';
import {
  BATTLE_THEME_AUDIO_KEY,
  BATTLE_THEME_AUDIO_PATHS,
  GAME_OVER_AUDIO_KEY,
  GAME_OVER_AUDIO_PATH,
  PLANE_ENEMY_VARIANTS,
  PLANE_TIER_AUDIO_ASSETS,
  SETTINGS_THEME_AUDIO_KEY,
  SETTINGS_THEME_AUDIO_PATHS,
  SOLDIER_DEATH_EXPLOSION_FRAMES,
  TANK_DEATH_EXPLOSION_FRAMES,
  TANK_ENGINE_AUDIO_KEY,
  TANK_ENGINE_AUDIO_PATH,
  WEAPON_ATLAS_PATH,
  WEAPON_LIBRARY,
  WEAPON_SHOT_SOUND_PROFILE,
  WEAPON_VFX_TABLE,
} from './systems/game-weapon-data';
import {
  createTerrainSubtextures as createGameTerrainSubtextures,
  createTextures as createGameTextures,
  rebuildThemeVisualTextures as rebuildGameThemeVisualTextures,
} from './systems/game-texture-system';
import {
  spawnLightningGroundBlast,
  spawnLightningProtectionBlob,
  triggerBarrageLightningSequence,
} from './systems/game-lightning-system';
import { drawPath as drawGamePath } from './systems/game-path-render-system';
import { startWave as startGameWave } from './systems/game-wave-system';
import { spawnEnemy as spawnGameEnemy } from './systems/game-enemy-spawn-system';
import { setupBuildPhaseControls as setupBuildPhaseControlsSystem } from './systems/game-build-phase-controls-system';
import { setupUI as setupGameUI } from './systems/game-ui-system';
import { setupAudioSettingsPanel as setupGameAudioSettingsPanel } from './systems/game-audio-settings-panel-system';
import { createScene as createGameScene } from './systems/game-scene-create-system';
import { moveEnemiesAlongPath as moveGameEnemiesAlongPath } from './systems/game-enemy-movement-system';
import { fireTowerWeapon as fireTowerWeaponSystem } from './systems/game-tower-fire-system';
import { endGame as endGameSystem } from './systems/game-endgame-system';
import { update as updateSystem } from './systems/game-update-system';
import { tryPlaceTower as tryPlaceTowerSystem } from './systems/game-tower-placement-system';
import { initializeGameplayAfterWorldSelection as initializeGameplayAfterWorldSelectionSystem } from './systems/game-world-init-system';
import { applyBlueprintWeaponRuntimeState as applyBlueprintWeaponRuntimeStateSystem } from './systems/game-blueprint-runtime-system';
import { restoreBlueprintRuntimeState as restoreBlueprintRuntimeStateSystem } from './systems/game-blueprint-restore-system';
import { setupLightningBlobControl as setupLightningBlobControlSystem } from './systems/game-lightning-control-ui-system';
import {
  canTriggerPlayerLightning as canTriggerPlayerLightningSystem,
  getPlayerLightningCooldownRemainingMs as getPlayerLightningCooldownRemainingMsSystem,
  refreshLightningBlobControl as refreshLightningBlobControlSystem,
  shouldBypassLightningWindowRequirement as shouldBypassLightningWindowRequirementSystem,
  triggerPlayerLightningFromControl as triggerPlayerLightningFromControlSystem,
} from './systems/game-lightning-control-logic-system';
import {
  countClearedByTier as countClearedByTierSystem,
  earnCommanderXP as earnCommanderXPSystem,
  isWorldUnlocked as isWorldUnlockedSystem,
  isOnlineWeaponUnlocked as isOnlineWeaponUnlockedSystem,
  checkOnlineWeaponUnlocks as checkOnlineWeaponUnlocksSystem,
  loadCommanderData as loadCommanderDataSystem,
  recordWorldCleared as recordWorldClearedSystem,
  returnToWorldSelectFromHud as returnToWorldSelectFromHudSystem,
  saveCommanderData as saveCommanderDataSystem,
} from './systems/game-commander-hud-system';
import { ONLINE_EXCLUSIVE_WEAPON_IDS } from './systems/commander-progress-system';
import {
  getDifficultyConfig as getDifficultyConfigSystem,
  getPooledShot as getPooledShotSystem,
  initShotSoundPools as initShotSoundPoolsSystem,
} from './systems/game-audio-shotpool-system';
import {
  getAudioBusLevel as getAudioBusLevelSystem,
  getConfiguredAudioVolume as getConfiguredAudioVolumeSystem,
  initAudioSettings as initAudioSettingsSystem,
  isPathGuideFeatureAvailable as isPathGuideFeatureAvailableSystem,
  loadGameplaySettings as loadGameplaySettingsSystem,
  persistAudioSettings as persistAudioSettingsSystem,
  persistGameplaySettings as persistGameplaySettingsSystem,
  setAudioBusLevel as setAudioBusLevelSystem,
} from './systems/game-audio-settings-core-system';
import {
  restartFromHud as restartFromHudSystem,
  setPathGuideVisible as setPathGuideVisibleSystem,
  syncGameplayPauseState as syncGameplayPauseStateSystem,
  togglePathGuide as togglePathGuideSystem,
  togglePlayerPause as togglePlayerPauseSystem,
  updatePauseHudButton as updatePauseHudButtonSystem,
} from './systems/game-pause-pathguide-system';
import {
  refreshAudioSettingsPanel as refreshAudioSettingsPanelSystem,
  toggleAudioSettingsPanel as toggleAudioSettingsPanelSystem,
} from './systems/game-audio-settings-ui-system';
import {
  runDeterministicWeaponStep as runDeterministicWeaponStepSystem,
  setupDebugHotkeys as setupDebugHotkeysSystem,
  setupFireDebugOverlay as setupFireDebugOverlaySystem,
  startDeterministicWeaponLoop as startDeterministicWeaponLoopSystem,
  stopDeterministicWeaponLoop as stopDeterministicWeaponLoopSystem,
} from './systems/game-debug-loop-system';
import {
  populateTestTowerLoadout as populateTestTowerLoadoutSystem,
  recordFireDebugShot as recordFireDebugShotSystem,
  updateFireDebugOverlay as updateFireDebugOverlaySystem,
} from './systems/game-fire-debug-system';
import { setupPlacementPreview as setupPlacementPreviewSystem } from './systems/game-placement-preview-system';
import {
  clearEnemySpawnEntrances as clearEnemySpawnEntrancesSystem,
  canLocalPlayerBuildTowers as canLocalPlayerBuildTowersSystem,
  handleEnemyTrayDrop as handleEnemyTrayDropSystem,
  highlightEnemySpawnDropTarget as highlightEnemySpawnDropTargetSystem,
  getCommanderRouteOptions as getCommanderRouteOptionsSystem,
  getEnemyTrayCards as getEnemyTrayCardsSystem,
  initializeMultiplayerMode as initializeMultiplayerModeSystem,
  isMultiplayerEnemyCommanderRole as isMultiplayerEnemyCommanderRoleSystem,
  isMultiplayerModeEnabled as isMultiplayerModeEnabledSystem,
  pushEnemyTrayCardsToHtml as pushEnemyTrayCardsToHtmlSystem,
  runDefenderTowerBot as runDefenderTowerBotSystem,
  runEnemyCommanderBot as runEnemyCommanderBotSystem,
  setupEnemySpawnEntrances as setupEnemySpawnEntrancesSystem,
  seedDefenderBotLoadout as seedDefenderBotLoadoutSystem,
  setCommanderPlaneLane as setCommanderPlaneLaneSystem,
  setCommanderRouteKey as setCommanderRouteKeySystem,
  shiftEnemyTrayCarousel as shiftEnemyTrayCarouselSystem,
  setupMultiplayerCommanderOverlay as setupMultiplayerCommanderOverlaySystem,
  startMultiplayerWave as startMultiplayerWaveSystem,
  syncMultiplayerCommanderVisibility as syncMultiplayerCommanderVisibilitySystem,
  teardownMultiplayerCommanderOverlay as teardownMultiplayerCommanderOverlaySystem,
  tryCommanderSpawn as tryCommanderSpawnSystem,
  updateEnemyDragDropHover as updateEnemyDragDropHoverSystem,
  updateMultiplayerCommanderHud as updateMultiplayerCommanderHudSystem,
  updateMultiplayerWaveRuntime as updateMultiplayerWaveRuntimeSystem,
} from './systems/game-multiplayer-system';
import BLUEPRINTS_EMBEDDED_HTML from './tower-blueprints-embedded.html?raw';

// --- Native platform helpers ---
const IS_NATIVE = Capacitor.isNativePlatform();
const BLUEPRINTS_EMBEDDED_HTML_WITH_BASE = BLUEPRINTS_EMBEDDED_HTML.includes('<head>')
  ? BLUEPRINTS_EMBEDDED_HTML.replace('<head>', '<head><base href="/" />')
  : BLUEPRINTS_EMBEDDED_HTML;

function vibrateFallback(pattern = 10) {
  try {
    if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
      navigator.vibrate(pattern);
      return true;
    }
  } catch (_) {}
  return false;
}

async function initNativeStatusBar() {
  if (!IS_NATIVE) return;
  try {
    if (Capacitor.getPlatform() === 'ios') {
      await StatusBar.setOverlaysWebView({ overlay: true });
      await StatusBar.hide();
    }
  } catch (e) {
    console.warn('StatusBar init failed:', e);
  }
}

export async function vibrateImpact(style = 'Medium') {
  const duration = style === 'Heavy' ? 30 : style === 'Light' ? 8 : 16;
  if (!IS_NATIVE) {
    vibrateFallback(duration);
    return;
  }
  try {
    const impactStyle = ImpactStyle?.[style] || ImpactStyle?.Medium;
    await Haptics.impact({ style: impactStyle });
  } catch (e) {
    vibrateFallback(duration);
    console.warn('Haptics impact failed, using vibration fallback.', e);
  }
}

export async function vibrateNotification(type = 'Success') {
  const pattern = type === 'Error' ? [20, 40, 20] : type === 'Warning' ? [16, 24, 16] : [12];
  if (!IS_NATIVE) {
    vibrateFallback(pattern);
    return;
  }
  try {
    const notificationType = NotificationType?.[type] || NotificationType?.Success;
    await Haptics.notification({ type: notificationType });
  } catch (e) {
    vibrateFallback(pattern);
    console.warn('Haptics notification failed, using vibration fallback.', e);
  }
}

export async function vibrateSelectionChanged() {
  if (!IS_NATIVE) {
    vibrateFallback(6);
    return;
  }
  try {
    await Haptics.selectionChanged();
  } catch (e) {
    vibrateFallback(6);
    console.warn('Haptics selection changed failed, using vibration fallback.', e);
  }
}

initNativeStatusBar();

const { sx, sy } = createBoardScalers({
  baseWidth: BASE_WIDTH,
  baseHeight: BASE_HEIGHT,
  boardWidth: BOARD_WIDTH,
  boardHeight: BOARD_HEIGHT,
});

const MAP_OFFSET_Y = sy(10);
const EmbossPipeline = new Phaser.Class({
  Extends: Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline,
  initialize: function EmbossPipeline (game) {
    Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline.call(this, {
      game,
      renderer: game.renderer,
      fragShader: [
        'precision mediump float;',
        'uniform sampler2D uMainSampler;',
        'varying vec2 outTexCoord;',
        'varying float outTintEffect;',
        'varying vec4 outTint;',
        'void main() {',
        '  vec4 c = texture2D(uMainSampler, outTexCoord);',
        '  float s = 0.0048;',
        '  vec4 tl = texture2D(uMainSampler, outTexCoord + vec2(-s, -s));',
        '  vec4 br = texture2D(uMainSampler, outTexCoord + vec2( s,  s));',
        '  vec3 emb = clamp(c.rgb + (tl.rgb - br.rgb) * 0.55, 0.0, 1.0);',
        '  vec4 tex = vec4(emb, c.a);',
        '  vec4 tnt = vec4(outTint.bgr * outTint.a, outTint.a);',
        '  if (outTintEffect == 0.0) { gl_FragColor = tex * tnt; }',
        '  else if (outTintEffect == 1.0) { gl_FragColor = vec4(mix(tex.rgb, outTint.bgr, outTint.a) * tex.a, tex.a); }',
        '  else { float g = dot(tex.rgb, vec3(0.299,0.587,0.114)); gl_FragColor = vec4(g * tnt.rgb, tex.a * outTint.a); }',
        '}',
      ].join('\n'),
    });
  },
});

const GameScene = new Phaser.Class({
  Extends: Phaser.Scene,

  initialize: function GameScene() {
    Phaser.Scene.call(this, { key: 'GameScene' });
  },

  isFreePlacementEnabled: function () {
    return FREE_PLACEMENT_ALL_WAVES;
  },

  getWeaponPowerTierInfo: function (baseDamage) {
    const safeDamage = Math.max(0, Number(baseDamage) || 0);
    if (safeDamage < WEAPON_POWER_TIER_BANDS.medium.min) {
      return { key: 'light', ...WEAPON_POWER_TIER_BANDS.light };
    }
    if (safeDamage < WEAPON_POWER_TIER_BANDS.heavy.min) {
      return { key: 'medium', ...WEAPON_POWER_TIER_BANDS.medium };
    }
    return { key: 'heavy', ...WEAPON_POWER_TIER_BANDS.heavy };
  },

  getPathLayoutTemplateForWave: function (waveNumber = 1) {
    const worldIndex = this.gameState?.selectedWorldIndex || 0;
    const world = WORLDS[worldIndex] || WORLDS[0];
    const templateIndex = world.pathIndex;
    return {
      template: PATH_LAYOUT_TEMPLATES[templateIndex],
      templateIndex,
    };
  },

  getFortressLayoutTemplateForWave: function (waveNumber = 1) {
    const worldIndex = this.gameState?.selectedWorldIndex || 0;
    const world = WORLDS[worldIndex] || WORLDS[0];
    const templateIndex = world.fortressIndex;
    return {
      template: FORTRESS_LAYOUT_TEMPLATES[templateIndex],
      templateIndex,
    };
  },

  applyFortressLayoutForWave: function (waveNumber = 1) {
    if (this.isFreePlacementEnabled()) {
      this.activeFortressLayoutIndex = -1;
      this.activeFortressLayoutId = 'free-placement';
      this.activeFortressLayoutName = 'Free Placement';
      this.towerStructures = [];
      this.towerBaseSlots = [];
      return;
    }

    const priorSlots = this.towerBaseSlots || [];
    const towers = this.towers?.children?.entries ? this.towers.children.entries.filter((tower) => tower.active) : [];
    const slotIndexByTower = new Map();

    towers.forEach((tower) => {
      const directIndex = tower.getData('towerBase')?.slotIndex;
      if (Number.isInteger(directIndex)) {
        slotIndexByTower.set(tower, directIndex);
        return;
      }

      let closestIndex = 0;
      let closestDistance = Number.POSITIVE_INFINITY;
      priorSlots.forEach((slot, idx) => {
        const dist = Phaser.Math.Distance.Between(tower.x, tower.y, slot.x, slot.y);
        if (dist < closestDistance) {
          closestDistance = dist;
          closestIndex = idx;
        }
      });
      slotIndexByTower.set(tower, closestIndex);
    });

    const selection = this.getFortressLayoutTemplateForWave(waveNumber);
    this.activeFortressLayoutIndex = selection.templateIndex;
    this.activeFortressLayoutId = selection.template.id;
    this.activeFortressLayoutName = selection.template.name;
    this.configureFortressLayout(selection.template);

    towers.forEach((tower) => {
      const mappedIndex = Phaser.Math.Clamp(slotIndexByTower.get(tower) || 0, 0, this.towerBaseSlots.length - 1);
      const slot = this.towerBaseSlots[mappedIndex];
      if (!slot) {
        return;
      }

      tower.setPosition(slot.x, slot.y);
      tower.setData('towerBase', slot);
      slot.occupied = true;

      const idLabel = tower.getData('idLabel');
      const hpBg = tower.getData('hpBg');
      const hpFill = tower.getData('hpFill');
      const fireAnimSprite = tower.getData('fireAnimSprite');
      const towerFoundation = tower.getData('towerFoundation');
      const towerGroundShadow = tower.getData('towerGroundShadow');

      if (idLabel?.active) {
        idLabel.setPosition(slot.x, slot.y - sy(2));
      }
      if (hpBg?.active) {
        hpBg.setPosition(slot.x, slot.y - sy(30));
      }
      if (hpFill?.active) {
        hpFill.setPosition(slot.x - sx(21), slot.y - sy(30));
      }
      if (fireAnimSprite?.active) {
        fireAnimSprite.setPosition(slot.x, slot.y);
      }
      if (towerFoundation?.active) {
        towerFoundation.setPosition(slot.x, slot.y);
      }
      if (towerGroundShadow?.active) {
        towerGroundShadow.setPosition(slot.x, slot.y + sy(18));
      }
    });
  },

  applyPathLayoutForWave: function (waveNumber = 1, redrawScene = false) {
    const selection = this.getPathLayoutTemplateForWave(waveNumber);
    const template = selection.template;
    this.activePathLayoutIndex = selection.templateIndex;
    this.activePathLayoutId = template.id;
    this.activePathLayoutName = template.name;
    const layoutMapYOffset = (template.id === 'delta-cross' || template.id === 'highland' || template.id === 'storm-alley' || template.id === 'double-back' || template.id === 'reapers-gate')
      ? (Number.isFinite(this.activeWorldMapCoordinateYOffset) ? this.activeWorldMapCoordinateYOffset : 0)
      : 0;
    const toWorldPoint = (point) => ({ x: sx(point.x), y: sy(point.y) + MAP_OFFSET_Y + layoutMapYOffset });
    const templateWorldPath = template.points.map(toWorldPoint);
    this.path = templateWorldPath.map((point) => ({ x: point.x, y: point.y }));
    this.pathSegments = this.buildPathSegments(this.path);
    const customBranches = CUSTOM_BRANCH_PATHS[this.activePathLayoutId] || null;
    this.branchPathsVisualOnly = Boolean(customBranches?.visualOnly);
    this.customSpawnRoutes = [];
    this.customRouteSpawnCursor = 0;

    if (customBranches) {
      const scaleBranch = (points) => points.map(toWorldPoint);
      this.secondaryPath = customBranches.secondary ? scaleBranch(customBranches.secondary) : null;
      this.secondaryPathSegments = this.secondaryPath ? this.buildPathSegments(this.secondaryPath) : null;
      this.tertiaryPath = customBranches.tertiary ? scaleBranch(customBranches.tertiary) : null;
      this.tertiaryPathSegments = this.tertiaryPath ? this.buildPathSegments(this.tertiaryPath) : null;
      this.quaternaryPath = customBranches.quaternary ? scaleBranch(customBranches.quaternary) : null;
      this.quaternaryPathSegments = this.quaternaryPath ? this.buildPathSegments(this.quaternaryPath) : null;
      this.extraVisualPaths = Array.isArray(customBranches.extraVisualPaths)
        ? customBranches.extraVisualPaths.map(scaleBranch)
        : [];
      this.customSpawnRoutes = [
        { key: 'route1', label: 'Route 1', path: this.path, segments: this.pathSegments },
        this.secondaryPath ? { key: 'route2', label: 'Route 2', path: this.secondaryPath, segments: this.secondaryPathSegments } : null,
        this.tertiaryPath ? { key: 'route3', label: 'Route 3', path: this.tertiaryPath, segments: this.tertiaryPathSegments } : null,
        this.quaternaryPath ? { key: 'route4', label: 'Route 4', path: this.quaternaryPath, segments: this.quaternaryPathSegments } : null,
        this.extraVisualPaths[0] ? { key: 'route5', label: 'Route 5', path: this.extraVisualPaths[0], segments: this.buildPathSegments(this.extraVisualPaths[0]) } : null,
        this.extraVisualPaths[1] ? { key: 'route6', label: 'Route 6', path: this.extraVisualPaths[1], segments: this.buildPathSegments(this.extraVisualPaths[1]) } : null,
        this.extraVisualPaths[2] ? { key: 'route7', label: 'Route 7', path: this.extraVisualPaths[2], segments: this.buildPathSegments(this.extraVisualPaths[2]) } : null,
      ].filter(Boolean);
      if (redrawScene) {
        this.drawPath();
      }
      return;
    }

    this.extraVisualPaths = [];

    // Secondary path: starts at marker ① and merges into main path at index 15 (first point to the right of ①)
    const secondaryJoinIndex = 15;
    if (this.path.length > secondaryJoinIndex) {
      this.secondaryPath = [
        { x: sx(227), y: sy(468) + MAP_OFFSET_Y + layoutMapYOffset },
        ...this.path.slice(secondaryJoinIndex),
      ];
      this.secondaryPathSegments = this.buildPathSegments(this.secondaryPath);
    } else {
      this.secondaryPath = null;
      this.secondaryPathSegments = null;
    }

    // Tertiary path: starts at marker ② and merges into main path at index 21 (directly below ②)
    const tertiaryJoinIndex = 21;
    if (this.path.length > tertiaryJoinIndex) {
      this.tertiaryPath = [
        { x: sx(706), y: sy(100) + MAP_OFFSET_Y + layoutMapYOffset },
        ...this.path.slice(tertiaryJoinIndex),
      ];
      this.tertiaryPathSegments = this.buildPathSegments(this.tertiaryPath);
    } else {
      this.tertiaryPath = null;
      this.tertiaryPathSegments = null;
    }

    // Quaternary path: starts at marker ③ and merges into main path at index 17
    const quaternaryJoinIndex = 17;
    if (this.path.length > quaternaryJoinIndex) {
      this.quaternaryPath = [
        { x: sx(425), y: sy(468) + MAP_OFFSET_Y + layoutMapYOffset },
        ...this.path.slice(quaternaryJoinIndex),
      ];
      this.quaternaryPathSegments = this.buildPathSegments(this.quaternaryPath);
    } else {
      this.quaternaryPath = null;
      this.quaternaryPathSegments = null;
    }

    if (!redrawScene) {
      return;
    }

    this.drawBackdrop();
    this.drawPath();
    this.drawTowerBases();
    this.restoreHudAndTrayVisibility();
  },

  preload: function () {
    const themedAssetPath = (themeName, subPath) =>
      'assets/ground-shaker/ground_shaker_asset/' + themeName + '/' + subPath;

    this.load.image('terrainSource', 'assets/ground-shaker/ground_shaker_asset/Terrains/terrain.png');
    this.load.spritesheet(
      'terrainSheet',
      'assets/ground-shaker/ground_shaker_asset/Terrains/terrain.png',
      { frameWidth: TERRAIN_TILE_SIZE, frameHeight: TERRAIN_TILE_SIZE }
    );
    this.load.image('gsTowerSheetBlank', 'assets/ground-shaker/ground_shaker_asset/Red/Towers/towers_walls_blank.png');
    this.load.image('gsTowerSheetGrass', 'assets/ground-shaker/ground_shaker_asset/Red/Towers/towers_walls_snow_1.png');
    this.load.spritesheet('gsWeaponsAtlas', WEAPON_ATLAS_PATH, { frameWidth: 96, frameHeight: 96 });
    this.load.image('gsEnemyTracks', 'assets/ground-shaker/ground_shaker_asset/Red/Bodies/body_tracks.png');
    this.load.spritesheet('gsEnemyHalftrack', 'assets/ground-shaker/ground_shaker_asset/Red/Bodies/body_halftrack.png', { frameWidth: 128, frameHeight: 128 });

    THEME_BY_TERRAIN_ROW.forEach((themeName) => {
      this.load.image('gsTowerSheetBlank_' + themeName, themedAssetPath(themeName, 'Towers/towers_walls_blank.png'));
      this.load.image('gsTowerSheetGrass_' + themeName, themedAssetPath(themeName, 'Towers/towers_walls_snow_1.png'));
      this.load.spritesheet('gsWeaponsAtlas_' + themeName, themedAssetPath(themeName, 'Weapons/weapons.png'), { frameWidth: 96, frameHeight: 96 });
      this.load.image('gsEnemyTracks_' + themeName, themedAssetPath(themeName, 'Bodies/body_tracks.png'));
      this.load.spritesheet('gsEnemyHalftrack_' + themeName, themedAssetPath(themeName, 'Bodies/body_halftrack.png'), { frameWidth: 128, frameHeight: 128 });

      WEAPON_LIBRARY.forEach((weapon) => {
        if (weapon.assetPath && weapon.sourceKey) {
          const themedPath = weapon.assetPath.replace('/Red/', '/' + themeName + '/');
          this.load.image(weapon.sourceKey + '_' + themeName, themedPath);
        }
      });
    });
    this.load.spritesheet(
      'trackTurret01FireSheet',
      'assets/ground-shaker/ground_shaker_asset/track_turret_01_anim_4x.gif',
      { frameWidth: 128, frameHeight: 128 }
    );
    this.load.spritesheet(
      'trackTurret02FireSheet',
      'assets/ground-shaker/ground_shaker_asset/track_turret_02_anim_4x.gif',
      { frameWidth: 128, frameHeight: 128 }
    );
    this.load.spritesheet(
      'soldierRunCp1Sheet',
      'assets/soldier-sprites/craftpix-net-507107-free-soldier-sprite-sheets-pixel-art/Soldier_1/Run.png',
      { frameWidth: 128, frameHeight: 128 }
    );
    this.load.spritesheet(
      'soldierRunCp2Sheet',
      'assets/soldier-sprites/craftpix-net-507107-free-soldier-sprite-sheets-pixel-art/Soldier_2/Run.png',
      { frameWidth: 128, frameHeight: 128 }
    );
    this.load.spritesheet(
      'soldierRunCp3Sheet',
      'assets/soldier-sprites/craftpix-net-507107-free-soldier-sprite-sheets-pixel-art/Soldier_3/Run.png',
      { frameWidth: 128, frameHeight: 128 }
    );
    this.load.spritesheet(
      'soldierShotCp1Sheet',
      'assets/soldier-sprites/craftpix-net-507107-free-soldier-sprite-sheets-pixel-art/Soldier_1/Shot_1.png',
      { frameWidth: 128, frameHeight: 128 }
    );
    this.load.spritesheet(
      'soldierShotCp2Sheet',
      'assets/soldier-sprites/craftpix-net-507107-free-soldier-sprite-sheets-pixel-art/Soldier_2/Shot_2.png',
      { frameWidth: 128, frameHeight: 128 }
    );
    this.load.spritesheet(
      'soldierShotCp3Sheet',
      'assets/soldier-sprites/craftpix-net-507107-free-soldier-sprite-sheets-pixel-art/Soldier_3/Shot_1.png',
      { frameWidth: 128, frameHeight: 128 }
    );
    this.load.spritesheet(
      'soldierShot2Cp1Sheet',
      'assets/soldier-sprites/craftpix-net-507107-free-soldier-sprite-sheets-pixel-art/Soldier_1/Shot_2.png',
      { frameWidth: 128, frameHeight: 128 }
    );
    this.load.spritesheet(
      'soldierShot2Cp3Sheet',
      'assets/soldier-sprites/craftpix-net-507107-free-soldier-sprite-sheets-pixel-art/Soldier_3/Shot_2.png',
      { frameWidth: 128, frameHeight: 128 }
    );
    this.load.spritesheet(
      'soldierHurtCp1Sheet',
      'assets/soldier-sprites/craftpix-net-507107-free-soldier-sprite-sheets-pixel-art/Soldier_1/Hurt.png',
      { frameWidth: 128, frameHeight: 128 }
    );
    this.load.spritesheet(
      'soldierHurtCp2Sheet',
      'assets/soldier-sprites/craftpix-net-507107-free-soldier-sprite-sheets-pixel-art/Soldier_2/Hurt.png',
      { frameWidth: 128, frameHeight: 128 }
    );
    this.load.spritesheet(
      'soldierHurtCp3Sheet',
      'assets/soldier-sprites/craftpix-net-507107-free-soldier-sprite-sheets-pixel-art/Soldier_3/Hurt.png',
      { frameWidth: 128, frameHeight: 128 }
    );
    this.load.spritesheet(
      'soldierGrenadeCp1Sheet',
      'assets/soldier-sprites/craftpix-net-507107-free-soldier-sprite-sheets-pixel-art/Soldier_1/Grenade.png',
      { frameWidth: 128, frameHeight: 128 }
    );
    this.load.spritesheet(
      'soldierGrenadeCp2Sheet',
      'assets/soldier-sprites/craftpix-net-507107-free-soldier-sprite-sheets-pixel-art/Soldier_2/Grenade.png',
      { frameWidth: 128, frameHeight: 128 }
    );
    this.load.spritesheet(
      'soldierGrenadeCp3Sheet',
      'assets/soldier-sprites/craftpix-net-507107-free-soldier-sprite-sheets-pixel-art/Soldier_3/Grenade.png',
      { frameWidth: 128, frameHeight: 128 }
    );
    this.load.spritesheet(
      'soldierRechargeCp3Sheet',
      'assets/soldier-sprites/craftpix-net-507107-free-soldier-sprite-sheets-pixel-art/Soldier_3/Recharge.png',
      { frameWidth: 128, frameHeight: 128 }
    );
    this.load.spritesheet(
      'soldierGrenadeExplosionCp1Sheet',
      'assets/soldier-sprites/craftpix-net-507107-free-soldier-sprite-sheets-pixel-art/Soldier_1/Explosion.png',
      { frameWidth: 128, frameHeight: 128 }
    );
    this.load.image('laserBeamMac55', 'assets/laser-sprites/mac/55.png');
    this.load.image('laserBeamMac56', 'assets/laser-sprites/mac/56.png');
    this.load.image('laserBeamMac57', 'assets/laser-sprites/mac/57.png');
    this.load.image('laserBeamMac58', 'assets/laser-sprites/mac/58.png');
    this.load.image('laserBeamMac59', 'assets/laser-sprites/mac/59.png');
    this.load.image('laserBeamWin55', 'assets/laser-sprites/windows/55.png');
    this.load.image('laserBeamWin56', 'assets/laser-sprites/windows/56.png');
    this.load.image('laserBeamWin57', 'assets/laser-sprites/windows/57.png');
    this.load.image('laserBeamWin58', 'assets/laser-sprites/windows/58.png');
    this.load.image('laserBeamWin59', 'assets/laser-sprites/windows/59.png');
    this.load.spritesheet('soldierProjectileGoldSheet', 'assets/shots/image.png', { frameWidth: 128, frameHeight: 128 });
    // Load individual grenade sprites (damage multipliers: 01=1.0, 02=1.15, 03=1.3 ...)
    for (let i = 1; i <= 10; i++) {
      this.load.image('grenade_' + String(i).padStart(2,'0'), 'assets/explosion-pack/bombs/grenade_' + String(i).padStart(2,'0') + '.png');
    }
    this.load.image('foozleProjectileBallisticSource', 'assets/foozle/Towers Weapons/Tower 05/Spritesheets/Tower 05 - Level 01 - Projectile.png');
    this.load.image('foozleProjectileRocketSource', 'assets/foozle/Towers Weapons/Tower 05/Spritesheets/Tower 05 - Level 03 - Projectile.png');
    this.load.image('foozleProjectileEnergySource', 'assets/foozle/Towers Weapons/Tower 06/Spritesheets/Tower 06 - Level 03 - Projectile.png');
    PLANE_ENEMY_VARIANTS.forEach((variant) => {
      variant.frameKeys.forEach((frameKey, index) => {
        this.load.image(frameKey, variant.assetPaths[index]);
      });
    });
    WEAPON_SHOT_AUDIO_ASSETS.forEach((item) => {
      this.load.audio(item.key, item.path);
    });
    PLANE_TIER_AUDIO_ASSETS.forEach((item) => {
      this.load.audio(item.key, item.path);
    });
    this.load.audio(BATTLE_THEME_AUDIO_KEY, BATTLE_THEME_AUDIO_PATHS);
    this.load.audio(SETTINGS_THEME_AUDIO_KEY, SETTINGS_THEME_AUDIO_PATHS);
    this.load.audio(TANK_ENGINE_AUDIO_KEY, TANK_ENGINE_AUDIO_PATH);
    this.load.audio(GAME_OVER_AUDIO_KEY, GAME_OVER_AUDIO_PATH);
    this.load.image('landingBg', 'assets/landing.png');
    for (let i = 1; i <= 6; i += 1) {
      this.load.image('lightningFrame' + i, 'assets/effects/lightning/Explosion_2_' + i + '.png');
    }
    for (let i = 1; i <= 6; i += 1) {
      this.load.image('wearFireFrame' + i, 'assets/effects/Fire/Fire' + i + '.png');
    }
    for (let i = 1; i <= 6; i += 1) {
      this.load.image('wearSmokeFrame' + i, 'assets/effects/Smoke/Smoke' + i + '.png');
    }
    for (let i = 1; i <= 4; i += 1) {
      this.load.image('lightningImpactFrame' + i, 'assets/effects/lightning-impact/Explosion_3_' + i + '.png');
    }
    for (let i = 1; i <= 10; i += 1) {
      this.load.image('lightningExplodeFrame' + i, 'assets/effects/lightning-explode/Explosion_8/Explosion_' + i + '.png');
    }
    this.load.image('thunderbolt', 'assets/effects/thunderbolt.png');
    this.load.image('electricityOverlay', 'assets/effects/electricity.png');
    this.load.image('electricityOverlayBlue', 'assets/effects/electricity_blue.png');
    this.load.spritesheet('enemySpawnFxSheet', 'assets/spawn/spawn.png', {
      frameWidth: 240,
      frameHeight: 320,
    });
    this.load.image('towerLightningLandmark', 'assets/towers/tower_lightning.png');
    this.load.image('humvee', 'assets/vehicles/humvee-top.png');
    for (let mapNumber = 1; mapNumber <= DOWNLOADED_WORLD_MAP_COUNT; mapNumber += 1) {
      this.load.image('downloadedWorldMap_' + mapNumber, 'assets/maps/tower-defense/LAIMap' + mapNumber + '.jpg');
    }
    // World preview screenshots
    for (let i = 0; i < 5; i++) {
      this.load.image('worldPreviewShot_' + i, 'assets/previews/world_' + i + '.png');
    }
    for (let i = 1; i <= 12; i += 1) {
      this.load.image(
        'tankExplosionFrame' + i,
        'assets/explosion-pack/explosion pack 1/Explosions pack/explosion-1-d/Sprites/explosion-d' + i + '.png'
      );
    }
    for (let i = 1; i <= 8; i += 1) {
      this.load.image(
        'eliteExplosionFrame' + i,
        'assets/explosion-pack/explosion pack 1/Explosions pack/explosion-1-b/Sprites/explosion-1-b-' + i + '.png'
      );
    }
    for (let i = 1; i <= 8; i += 1) {
      this.load.image(
        'soldierExplosionFrame' + i,
        'assets/explosion-pack/explosion pack 1/Explosions pack/explosion-1-b/Sprites/explosion-1-b-' + i + '.png'
      );
    }
  },

  create: function () {
    return createGameScene.call(this);
  },

  createEnemyAnimations: function () {
    const activeTheme = this.activeVisualTheme || this.getThemeVariantForLevel(this.gameState?.level || 1);
    const themedHalftrackSheetKey = 'gsEnemyHalftrack_' + activeTheme;
    const themedHalftrackAnimKey = 'enemyHalftrackDrive_' + activeTheme;
    const ensureAnimationFrames = (animKey, textureKey, start, end, frameRate, repeat) => {
      const existingAnim = this.anims.get(animKey);
      const usesExpectedTexture = !!existingAnim
        && Array.isArray(existingAnim.frames)
        && existingAnim.frames.length > 0
        && existingAnim.frames.every((frame) => frame.textureKey === textureKey);

      if (existingAnim && !usesExpectedTexture) {
        this.anims.remove(animKey);
      }

      if (!this.anims.exists(animKey)) {
        this.anims.create({
          key: animKey,
          frames: this.anims.generateFrameNumbers(textureKey, { start, end }),
          frameRate,
          repeat,
        });
      }
    };

    if (!this.anims.exists(themedHalftrackAnimKey) && this.textures.exists(themedHalftrackSheetKey)) {
      this.anims.create({
        key: themedHalftrackAnimKey,
        frames: this.anims.generateFrameNumbers(themedHalftrackSheetKey, { start: 0, end: 1 }),
        frameRate: 7,
        repeat: -1,
      });
    }

    ensureAnimationFrames('soldierRunCp1', 'soldierRunCp1Sheet', 0, 7, 13, -1);
    ensureAnimationFrames('soldierRunCp2', 'soldierRunCp2Sheet', 0, 7, 13, -1);
    ensureAnimationFrames('soldierRunCp3', 'soldierRunCp3Sheet', 0, 5, 12, -1);
    ensureAnimationFrames('soldierFireCp1', 'soldierShotCp1Sheet', 0, 3, 28, 0);
    ensureAnimationFrames('soldierFireCp2', 'soldierShotCp2Sheet', 2, 3, 30, 0);
    ensureAnimationFrames('soldierFireCp3', 'soldierShotCp3Sheet', 0, 3, 28, 0);
    ensureAnimationFrames('soldierFireVerticalDownCp1', 'soldierShotCp1Sheet', 0, 1, 12, 0);
    ensureAnimationFrames('soldierFireVerticalUpCp1', 'soldierShotCp1Sheet', 2, 3, 12, 0);
    ensureAnimationFrames('soldierHurtCp1', 'soldierHurtCp1Sheet', 0, 2, 18, 0);
    ensureAnimationFrames('soldierHurtCp2', 'soldierHurtCp2Sheet', 0, 2, 18, 0);
    ensureAnimationFrames('soldierHurtCp3', 'soldierHurtCp3Sheet', 0, 3, 18, 0);
    ensureAnimationFrames('soldierGrenadeCp1', 'soldierGrenadeCp1Sheet', 0, 8, 12, 0);
    ensureAnimationFrames('soldierGrenadeCp2', 'soldierGrenadeCp2Sheet', 0, 15, 12, 0);
    ensureAnimationFrames('soldierGrenadeCp3', 'soldierGrenadeCp3Sheet', 0, 7, 12, 0);
    ensureAnimationFrames('soldierRechargeCp3', 'soldierRechargeCp3Sheet', 0, 7, 10, 0);
    ensureAnimationFrames('soldierGrenadeExplosionCp1', 'soldierGrenadeExplosionCp1Sheet', 0, 8, 14, 0);
    ensureAnimationFrames('soldierCockCp1', 'soldierShot2Cp1Sheet', 0, 2, 24, 0);
    ensureAnimationFrames('soldierCockCp2', 'soldierShotCp2Sheet', 0, 1, 24, 0);
    ensureAnimationFrames('soldierCockCp3', 'soldierShot2Cp3Sheet', 0, 2, 24, 0);

    if (!this.anims.exists('enemySpawnFxAllFrames') && this.textures.exists('enemySpawnFxSheet')) {
      this.anims.create({
        key: 'enemySpawnFxAllFrames',
        frames: this.anims.generateFrameNumbers('enemySpawnFxSheet', { start: 0, end: 99 }),
        frameRate: 36,
        repeat: 0,
      });
    }

    if (!this.anims.exists('soldierProjectileGoldRow1')) {
      this.anims.create({
        key: 'soldierProjectileGoldRow1',
        frames: this.anims.generateFrameNumbers('soldierProjectileGoldSheet', { start: 8, end: 11 }),
        frameRate: 18,
        repeat: -1,
      });
    }

  },

  createWeaponAnimations: function () {
    if (!this.anims.exists('trackTurret01Fire')) {
      this.anims.create({
        key: 'trackTurret01Fire',
        frames: this.anims.generateFrameNumbers('trackTurret01FireSheet', { start: 0, end: 3 }),
        frameRate: 12,
        repeat: -1,
      });
    }

    if (!this.anims.exists('trackTurret02Fire')) {
      this.anims.create({
        key: 'trackTurret02Fire',
        frames: this.anims.generateFrameNumbers('trackTurret02FireSheet', { start: 0, end: 3 }),
        frameRate: 12,
        repeat: -1,
      });
    }
  },

  createTextures: function () {
    return createGameTextures.call(this);
  },

  rebuildThemeVisualTextures: function (themeName) {
    return rebuildGameThemeVisualTextures.call(this, themeName);
  },

  configureFortressLayout: function (layoutTemplate = null) {
    const toWorld = (col, row) => ({
      x: sx((col * FORTRESS_GRID_SIZE) + (FORTRESS_GRID_SIZE * 0.5)),
      y: sy((row * FORTRESS_GRID_SIZE) + (FORTRESS_GRID_SIZE * 0.5)) + MAP_OFFSET_Y,
    });

    const slotCells = Array.isArray(layoutTemplate?.slotCells) && layoutTemplate.slotCells.length === 24
      ? layoutTemplate.slotCells
      : DEFAULT_FORTRESS_SLOT_CELLS;

    const structureCells = Array.isArray(layoutTemplate?.structureCells) && layoutTemplate.structureCells.length > 0
      ? layoutTemplate.structureCells
      : slotCells.map((cell) => ({ ...cell, key: 'gsBaseBlank' }));

    this.towerStructures = structureCells.map((cell) => {
      return {
        ...toWorld(cell.col, cell.row),
        key: cell.key,
        flipX: !!cell.flipX,
        rotation: cell.rotation || 0,
      };
    });

    this.towerBaseSlots = slotCells.map((cell, slotIndex) => {
      return {
        ...toWorld(cell.col, cell.row),
        occupied: false,
        slotIndex,
      };
    });
  },

  createTerrainSubtextures: function (rowIndex) {
    return createGameTerrainSubtextures.call(this, rowIndex);
  },

  generateWorldPreviews: function () {
    if (this._worldPreviewKeys?.length === WORLDS.length) return; // already generated

    const previewW = 220, previewH = 130;
    const scaleX = previewW / BOARD_WIDTH;
    const hudBottom = (14 + 78) * (BOARD_HEIGHT / BASE_HEIGHT); // 138
    const mapOY   = 10 * (BOARD_HEIGHT / BASE_HEIGHT);          // 15
    const scaleY  = previewH / (BOARD_HEIGHT - hudBottom);

    const toPX = (rawX) => rawX * (BOARD_WIDTH / BASE_WIDTH) * scaleX;
    const toPY = (rawY) => (rawY * (BOARD_HEIGHT / BASE_HEIGHT) + mapOY - hudBottom) * scaleY;
    const toFX = (col)  => col * FORTRESS_GRID_SIZE * (BOARD_WIDTH / BASE_WIDTH) * scaleX;
    const toFY = (row)  => (row * FORTRESS_GRID_SIZE * (BOARD_HEIGHT / BASE_HEIGHT) + mapOY - hudBottom) * scaleY;

    const gameTileSize   = sx(74);
    const tilePx         = gameTileSize * scaleX;           // ~16px per tile
    const roadHalfPx     = sx(14.5) * scaleX;              // ~3.2px half-road
    const baseKey        = this.textures.exists('gsBaseBlank') ? 'gsBaseBlank' : null;
    const baseDisplayPx  = sx(62) * 0.82 * GAMEPLAY_VISUAL_SCALE * scaleX * 1.0;

    this._worldPreviewKeys = [];
    this._worldPreviewRTs  = [];

    for (let wi = 0; wi < WORLDS.length; wi++) {
      const world = WORLDS[wi];
      const tempObjs = [];

      // Each world uses a different terrain row for visual variety
      const worldTerrainRow = TERRAIN_ROW_LEVELS[wi % TERRAIN_ROW_LEVELS.length];
      const bgFrameId = worldTerrainRow * 7;
      const tilesX = Math.ceil(previewW / tilePx) + 2;
      const tilesY = Math.ceil(previewH / tilePx) + 2;
      for (let tr = 0; tr < tilesY; tr++) {
        for (let tc = 0; tc < tilesX; tc++) {
          const tx = tc * tilePx;
          const ty = tr * tilePx - (hudBottom - mapOY) * scaleY;
          if (ty + tilePx < 0 || ty > previewH) continue;
          tempObjs.push(
            this.add.image(tx + tilePx / 2, ty + tilePx / 2, 'terrainSheet', bgFrameId)
              .setDisplaySize(tilePx + 1, tilePx + 1)
          );
        }
      }

      // --- Dirt road preview ---
      const pathPts = PATH_LAYOUT_TEMPLATES[world.pathIndex].points;
      const previewPathPts = pathPts.map((pt) => ({ x: toPX(pt.x), y: toPY(pt.y) }));
      const previewRoadPath = this.buildPlayableDirtRoadPath(previewPathPts, {
        safeTop: 18,
        safeBottom: previewH - 22,
        minX: 10,
        maxX: previewW - 10,
        extraTurns: 1.28,
      });
      const gRoad = this.add.graphics();
      gRoad.lineStyle(roadHalfPx * 2 + 2.5, 0x5a462d, 1);
      gRoad.beginPath();
      this.tracePathPolyline(gRoad, previewRoadPath);
      gRoad.strokePath();
      gRoad.lineStyle(roadHalfPx * 2, 0x8a6a3d, 1);
      gRoad.beginPath();
      this.tracePathPolyline(gRoad, previewRoadPath);
      gRoad.strokePath();
      gRoad.lineStyle(0.8, 0xb78f5a, 0.4);
      gRoad.beginPath();
      this.tracePathPolyline(gRoad, previewRoadPath);
      gRoad.strokePath();
      tempObjs.push(gRoad);

      // --- Tower bases using actual gsBaseBlank texture ---
      FORTRESS_LAYOUT_TEMPLATES[world.fortressIndex].slotCells.forEach(cell => {
        const bx = toFX(cell.col), by = toFY(cell.row);
        if (by < 0 || by > previewH) return;
        tempObjs.push(
          baseKey
            ? this.add.image(bx, by, baseKey).setDisplaySize(baseDisplayPx, baseDisplayPx)
            : this.add.circle(bx, by, baseDisplayPx / 2, 0x2a2a20, 0.85)
        );
      });

      // --- Capture to RenderTexture ---
      const rt = this.add.renderTexture(0, 0, previewW, previewH);
      rt.draw(tempObjs);
      const key = 'worldPreview_' + wi;
      rt.saveTexture(key);
      rt.setVisible(false).setActive(false);
      this._worldPreviewRTs.push(rt);
      this._worldPreviewKeys.push(key);

      tempObjs.forEach(o => o.destroy());
    }
  },

  getTerrainRowForLevel: function (level) {
    const index = (Math.max(1, level) - 1) % TERRAIN_ROW_LEVELS.length;
    return TERRAIN_ROW_LEVELS[index];
  },

  getThemeVariantForLevel: function (level) {
    const row = this.getTerrainRowForLevel(level);
    return THEME_BY_TERRAIN_ROW[row] || THEME_BY_TERRAIN_ROW[0];
  },

  updateTerrainThemeAssets: function () {
    const row = this.getTerrainRowForLevel(this.gameState?.level || 1);
    const themeVariant = this.getThemeVariantForLevel(this.gameState?.level || 1);
    const rowChanged = this.activeTerrainRow !== row;
    const themeChanged = this.activeVisualTheme !== themeVariant;

    if (!rowChanged && !themeChanged) {
      return false;
    }

    this.activeTerrainRow = row;
    if (rowChanged) {
      this.createTerrainSubtextures(row);
    }
    if (themeChanged) {
      this.rebuildThemeVisualTextures(themeVariant);
    }
    return true;
  },

  drawBackdrop: function () {
    if (this.mapLayer) {
      this.mapLayer.destroy(true);
    }

    this.activeWorldMapCoordinateYOffset = 0;
    this.lightningLandmarkSprite = null;
    this.mapLayer = this.add.container(0, 0).setDepth(-5);

    const worldIndex = this.gameState?.selectedWorldIndex || 0;
    const worldBackdropYOffset = {
      7: sy(10),
      8: -sy(56), // World 9: raise map further
      10: sy(80), // World 11: nudge map/path/regions a little lower
    };
    const isMobileViewport = typeof window !== 'undefined' && window.innerWidth <= 900;
    const worldBackdropMobileYOffset = {
      10: isMobileViewport ? sy(18) : 0, // World 11 mobile: lower map/path/regions slightly
      11: isMobileViewport ? sy(18) : 0, // World 12 mobile: lower map/path/regions slightly
      8: isMobileViewport ? -sy(72) : 0, // World 9 mobile: raise higher without changing width
    };
    const worldBackdropAlignTop = {
      7: true, // World 8 (Delta Cross): keep map top aligned to viewport top
    };
    const worldBackdropTopNudge = {
      7: -sy(146), // World 8: raise map and synced paths slightly more
    };
    const mapYOffset = (worldBackdropYOffset[worldIndex] || 0) + (worldBackdropMobileYOffset[worldIndex] || 0);
    const world = WORLDS[worldIndex] || WORLDS[0];
    const mapNumber = ((world?.pathIndex ?? worldIndex) % DOWNLOADED_WORLD_MAP_COUNT) + 1;
    const downloadedMapKey = 'downloadedWorldMap_' + mapNumber;
    this.activeWorldMapKey = this.textures.exists(downloadedMapKey) ? downloadedMapKey : null;

    if (this.activeWorldMapKey) {
      const mapTexture = this.textures.get(this.activeWorldMapKey);
      const source = mapTexture?.getSourceImage ? mapTexture.getSourceImage() : null;
      const texWidth = Math.max(1, source?.width || BOARD_WIDTH);
      const texHeight = Math.max(1, source?.height || BOARD_HEIGHT);
      const cameraZoom = Math.max(0.01, this.cameras?.main?.zoom || 1);
      const visibleWidth = BOARD_WIDTH / cameraZoom;
      const visibleHeight = BOARD_HEIGHT / cameraZoom;
      let playfieldTop = sy(98) + MAP_OFFSET_Y;
      if (typeof document !== 'undefined' && this.game?.canvas) {
        const hudRoot = document.getElementById('ab-hud-overlay');
        const canvasRect = this.game.canvas.getBoundingClientRect();
        const hudRect = hudRoot?.getBoundingClientRect?.();
        if (hudRect && canvasRect?.height) {
          const hudHeightBoardUnits = (hudRect.height / Math.max(1, canvasRect.height)) * BOARD_HEIGHT;
          playfieldTop = Math.max(sy(64), hudHeightBoardUnits + sy(2));
        }
      }
      const playfieldBottom = BOARD_HEIGHT - sy(104);
      const playfieldHeight = Math.max(sy(180), playfieldBottom - playfieldTop);
      const backdropScale = Math.max(visibleWidth / texWidth, visibleHeight / texHeight);
      const defaultBackdropY = playfieldTop + (playfieldHeight * 0.5) + mapYOffset;
      const backdrop = this.add.image(BOARD_WIDTH * 0.5, defaultBackdropY, this.activeWorldMapKey)
        .setDisplaySize(texWidth * backdropScale, texHeight * backdropScale)
        .setAlpha(0.96)
        .setDepth(0.03);
      this.activeWorldMapCoordinateYOffset = mapYOffset;
      if (worldBackdropAlignTop[worldIndex]) {
        const alignedY = backdrop.displayHeight * 0.5 + (worldBackdropTopNudge[worldIndex] || 0);
        backdrop.setY(alignedY);
        this.activeWorldMapCoordinateYOffset = alignedY - defaultBackdropY;
      }

      // Keep gameplay routes synced to world-specific backdrop shifts.
      if (this.activePathLayoutId === 'delta-cross' || this.activePathLayoutId === 'highland' || this.activePathLayoutId === 'storm-alley' || this.activePathLayoutId === 'double-back' || this.activePathLayoutId === 'reapers-gate') {
        this.applyPathLayoutForWave(Math.max(1, Number(this.gameState?.wave) || 1), false);
      }
      this.mapLayer.add(backdrop);

      const isAttackRole = this.gameState?.multiplayerRole === 'enemyCommander';
      if (!isAttackRole && (worldIndex === 0 || worldIndex === 9) && this.textures.exists('towerLightningLandmark')) {
        const lightningTower = this.add.image(sx(538), sy(180) + MAP_OFFSET_Y, 'towerLightningLandmark')
          .setDisplaySize(sx(52), sy(84))
          .setAlpha(0.64)
          .clearTint()
          .setBlendMode(Phaser.BlendModes.NORMAL)
          .setDepth(0.23);
        this.mapLayer.add(lightningTower);
        this.lightningLandmarkSprite = lightningTower;
      }

      // tintOverlay removed – was producing a visible dark tint over the map

      const topMatteHeight = 0;

      // bottomMatte removed – was producing a visible dark rectangle strip

      this.lakeShimmers = [];
      return;
    }

    const row = this.activeTerrainRow >= 0 ? this.activeTerrainRow : this.getTerrainRowForLevel(this.gameState?.level || 1);
    const bgFrameId = row * 7;
    const bgTileSize = sx(74);

    for (let y = -bgTileSize; y < BOARD_HEIGHT + bgTileSize; y += bgTileSize) {
      for (let x = -bgTileSize; x < BOARD_WIDTH + bgTileSize; x += bgTileSize) {
        const tile = this.add.image(x + bgTileSize * 0.5, y + bgTileSize * 0.5, 'terrainSheet', bgFrameId)
          .setDisplaySize(bgTileSize + 1, bgTileSize + 1)
          .setAlpha(1)
          .setDepth(0.05);
        this.mapLayer.add(tile);
      }
    }

    const craterFrameId = bgFrameId + 1;
    const bushFrameId = bgFrameId + 2;
    const decorPlacements = [
      // Upper-right accent cluster.
      { frame: craterFrameId, x: 848, y: 186, size: 58, alpha: 0.93, rot: -0.07 },
      { frame: craterFrameId, x: 884, y: 210, size: 56, alpha: 0.94, rot: 0.04 },
      { frame: bushFrameId, x: 932, y: 214, size: 74, alpha: 0.97, rot: -0.08 },

      // Lower-left anchor cluster.
      { frame: craterFrameId, x: 168, y: 448, size: 60, alpha: 0.93, rot: 0.06 },
      { frame: craterFrameId, x: 206, y: 476, size: 58, alpha: 0.94, rot: -0.03 },
      { frame: bushFrameId, x: 286, y: 468, size: 76, alpha: 0.97, rot: -0.05 },

      // Lower-mid filler cluster.
      { frame: craterFrameId, x: 498, y: 378, size: 56, alpha: 0.92, rot: 0.03 },
      { frame: bushFrameId, x: 570, y: 392, size: 72, alpha: 0.96, rot: 0.06 },
    ];

    decorPlacements.forEach((decor) => {
      const worldX = Math.round(sx(decor.x));
      const worldY = Math.round(sy(decor.y) + MAP_OFFSET_Y);
      const image = this.add.image(
        worldX,
        worldY,
        'terrainSheet',
        decor.frame
      )
        .setDisplaySize(sx(decor.size), sx(decor.size))
        .setRotation(decor.rot)
        .setAlpha(decor.alpha)
        .setDepth(0.2);
      this.mapLayer.add(image);
    });

    const isAttackRole = this.gameState?.multiplayerRole === 'enemyCommander';
    if (!isAttackRole && (worldIndex === 0 || worldIndex === 9) && this.textures.exists('towerLightningLandmark')) {
      const lightningTower = this.add.image(sx(770), sy(360) + MAP_OFFSET_Y, 'towerLightningLandmark')
        .setDisplaySize(sx(52), sy(84))
        .setAlpha(0.64)
        .clearTint()
        .setBlendMode(Phaser.BlendModes.NORMAL)
        .setDepth(0.23);
      this.mapLayer.add(lightningTower);
      this.lightningLandmarkSprite = lightningTower;
    }

    this.lakeShimmers = [];
  },

  triggerBarrageLightningSequence: function (barrageIndex = 1, options = {}) {
    return triggerBarrageLightningSequence.call(this, barrageIndex, options);
  },

  applyLightningImpactDamage: function (impactX, impactY, barrageIndex = 1, isBranchStrike = false) {
    this.spawnLightningGroundBlast(impactX, impactY, {
      barrageIndex,
      isBranchStrike,
    });

    const activeEnemies = this.enemies?.children?.entries || [];
    if (!activeEnemies.length) {
      return;
    }

    const coreRadius = barrageIndex >= 2 ? sx(40) : sx(34);
    const splashRadius = barrageIndex >= 2 ? sx(118) : sx(96);
    const coreRadiusSq = coreRadius * coreRadius;
    const splashRadiusSq = splashRadius * splashRadius;

    activeEnemies.forEach((enemy) => {
      if (!enemy?.active || enemy.getData('isDying') || enemy.getData('isTestDummy')) {
        return;
      }

      const isPlane = !!enemy.getData('isPlane');
      const enemyType = enemy.getData('enemyType') || '';
      const isTank = enemyType === 'tank';
      const isEliteSoldier = enemyType === 'eliteSoldier' || !!enemy.getData('isEliteSoldier');

      const dx = enemy.x - impactX;
      const dy = enemy.y - impactY;
      const distSq = (dx * dx) + (dy * dy);
      const roleRadiusMul = isPlane ? 1.72 : ((isTank || isEliteSoldier) ? 1.28 : 1);
      const effectiveSplashSq = splashRadiusSq * roleRadiusMul * roleRadiusMul;
      if (distSq > effectiveSplashSq) {
        return;
      }

      const currentHealth = Math.max(0, Number(enemy.getData('health')) || 0);
      if (currentHealth <= 0) {
        return;
      }

      const maxHealth = Math.max(currentHealth, Number(enemy.getData('maxHealth')) || currentHealth);
      const isBarrageTarget = !!enemy.getData('isBarrage');
      let damage = 0;
      const isHeavyPriority = isPlane || isTank || isEliteSoldier;

      if (distSq <= coreRadiusSq) {
        // Core arc impact is intended to execute units so lightning feels decisive.
        damage = currentHealth + (isBarrageTarget ? maxHealth * 1.2 : maxHealth * 0.7);
      } else {
        const dist = Math.sqrt(distSq);
        const effectiveSplashRadius = Math.sqrt(effectiveSplashSq);
        const falloff = 1 - Phaser.Math.Clamp((dist - coreRadius) / Math.max(1, (effectiveSplashRadius - coreRadius)), 0, 1);
        const barrageDamage = maxHealth * (0.55 + (falloff * 0.85));
        const normalDamage = maxHealth * (0.35 + (falloff * 0.55));
        damage = isBarrageTarget ? barrageDamage : normalDamage;
      }

      if (isHeavyPriority) {
        // Heavy/air barrage units should not shrug off lightning; enforce a lethal floor.
        damage = Math.max(damage, currentHealth + (maxHealth * 0.35));
      } else if (isBarrageTarget) {
        damage = Math.max(damage, currentHealth * 0.92);
      }

      if (isBranchStrike) {
        damage *= isHeavyPriority ? 0.86 : 0.72;
      }

      // Lightning explosion animation directly on each struck enemy
      if (this.textures?.exists('lightningExplodeFrame1') || this.textures?.exists('lightningImpactFrame1')) {
        this.ensureLightningSpriteAnimations();
        const isCoreHit = distSq <= coreRadiusSq;
        const eKey = this.textures?.exists('lightningExplodeFrame1') ? 'lightningExplodeFrame1' : 'lightningImpactFrame1';
        const eAnim = this.anims?.exists('lightningExplodeAnim') ? 'lightningExplodeAnim' : (this.anims?.exists('lightningBoltGroundCap') ? 'lightningBoltGroundCap' : null);
        const frameImage = this.textures.get(eKey)?.getSourceImage();
        const baseW = Math.max(1, Number(frameImage?.width) || 96);
        const baseH = Math.max(1, Number(frameImage?.height) || 96);
        const targetSize = isCoreHit ? sx(90) : (isBranchStrike ? sx(52) : sx(68));
        const scale = targetSize / Math.max(baseW, baseH);
        const impactAlpha = isCoreHit ? 0.9 : 0.6;
        const imp = this.add.sprite(enemy.x, enemy.y, eKey)
          .setDisplaySize(baseW * scale, baseH * scale)
          .setDepth(8.7)
          .setAlpha(impactAlpha)
          .setBlendMode(Phaser.BlendModes.ADD);
        if (eAnim) {
          imp.play(eAnim);
          imp.once('animationcomplete', () => { if (imp?.active) imp.destroy(); });
        } else {
          this.tweens.add({ targets: imp, alpha: 0, scaleX: imp.scaleX * 1.25, scaleY: imp.scaleY * 1.25, duration: 260, ease: 'Quad.easeOut', onComplete: () => { if (imp?.active) imp.destroy(); } });
        }
      }

      this.applyEnemyDamage(enemy, Math.max(0.8, damage), { x: impactX, y: impactY });
    });
  },

  spawnLightningGroundBlast: function (x, y, options = {}) {
    return spawnLightningGroundBlast.call(this, x, y, options);
  },

  ensureLightningSpriteAnimations: function () {
    if (!this.anims || !this.textures?.exists('lightningFrame1')) {
      return;
    }

    if (!this.anims.exists('lightningBoltTravel')) {
      this.anims.create({
        key: 'lightningBoltTravel',
        frames: [1, 2, 3].map((i) => ({ key: 'lightningFrame' + i })),
        frameRate: 26,
        repeat: 0,
      });
    }

    if (!this.anims.exists('lightningBoltImpact')) {
      this.anims.create({
        key: 'lightningBoltImpact',
        frames: [4, 5, 6].map((i) => ({ key: 'lightningFrame' + i })),
        frameRate: 26,
        repeat: 0,
      });
    }

    if (!this.anims.exists('lightningBoltFull')) {
      this.anims.create({
        key: 'lightningBoltFull',
        frames: [1, 2, 3, 4, 5, 6].map((i) => ({ key: 'lightningFrame' + i })),
        frameRate: 30,
        repeat: 0,
      });
    }

    if (this.textures?.exists('lightningImpactFrame1') && !this.anims.exists('lightningBoltGroundCap')) {
      this.anims.create({
        key: 'lightningBoltGroundCap',
        frames: [1, 2, 3, 4].map((i) => ({ key: 'lightningImpactFrame' + i })),
        frameRate: 28,
        repeat: 0,
      });
    }

    if (this.textures?.exists('lightningExplodeFrame1') && !this.anims.exists('lightningExplodeAnim')) {
      this.anims.create({
        key: 'lightningExplodeAnim',
        frames: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => ({ key: 'lightningExplodeFrame' + i })),
        frameRate: 22,
        repeat: 0,
      });
    }
  },

  spawnLightningBoltGroundCap: function (x, y) {
    if (!this.textures?.exists('lightningImpactFrame1')) {
      return;
    }

    const frameImage = this.textures.get('lightningImpactFrame1')?.getSourceImage();
    const baseW = Math.max(1, Number(frameImage?.width) || 76);
    const baseH = Math.max(1, Number(frameImage?.height) || 76);
    const targetW = sx(38);
    const targetH = sy(38);
    const scale = Math.max(targetW / baseW, targetH / baseH);

    const cap = this.add.sprite(x, y + sy(6), 'lightningImpactFrame1')
      .setDisplaySize(baseW * scale, baseH * scale)
      .setDepth(8.34)
      .setBlendMode(Phaser.BlendModes.ADD)
      .setAlpha(0.36);

    if (this.anims?.exists('lightningBoltGroundCap')) {
      cap.play('lightningBoltGroundCap');
      cap.once('animationcomplete', () => {
        if (cap?.active) {
          cap.destroy();
        }
      });
      return;
    }

    this.tweens.add({
      targets: cap,
      alpha: 0,
      duration: 120,
      ease: 'Quad.easeOut',
      onComplete: () => {
        if (cap?.active) {
          cap.destroy();
        }
      },
    });
  },

  resolveLightningStrikeGroundPoint: function (x, y) {
    const minX = sx(42);
    const maxX = BOARD_WIDTH - sx(42);
    const minY = sy(98) + MAP_OFFSET_Y;
    const maxY = BOARD_HEIGHT - sy(92);

    const clampedX = Phaser.Math.Clamp(x, minX, maxX);
    const clampedY = Phaser.Math.Clamp(y, minY, maxY);

    const segmentGroups = [
      this.pathSegments,
      this.secondaryPathSegments,
      this.tertiaryPathSegments,
      this.quaternaryPathSegments,
    ];

    let best = null;
    segmentGroups.forEach((segments) => {
      if (!Array.isArray(segments) || segments.length === 0) {
        return;
      }

      segments.forEach((segment) => {
        const x1 = segment.start.x;
        const y1 = segment.start.y;
        const x2 = segment.end.x;
        const y2 = segment.end.y;
        const dx = x2 - x1;
        const dy = y2 - y1;
        const lenSq = (dx * dx) + (dy * dy);
        if (lenSq <= 0.0001) {
          return;
        }

        const t = Phaser.Math.Clamp(((clampedX - x1) * dx + (clampedY - y1) * dy) / lenSq, 0, 1);
        const px = x1 + (dx * t);
        const py = y1 + (dy * t);
        const ddx = clampedX - px;
        const ddy = clampedY - py;
        const distSq = (ddx * ddx) + (ddy * ddy);

        if (!best || distSq < best.distSq) {
          best = { x: px, y: py, distSq };
        }
      });
    });

    const maxSnapDistance = sx(72);
    if (best && best.distSq <= (maxSnapDistance * maxSnapDistance)) {
      return {
        x: Phaser.Math.Clamp(best.x, minX, maxX),
        y: Phaser.Math.Clamp(best.y, minY, maxY),
      };
    }

    if (this.isOnValidTerrain?.(clampedX, clampedY) !== false) {
      return { x: clampedX, y: clampedY };
    }

    // Small radial search to keep impact on valid ground if projected point is invalid terrain.
    const ringSteps = [
      sx(10), sx(18), sx(28), sx(40), sx(56), sx(72),
    ];
    for (let r = 0; r < ringSteps.length; r += 1) {
      const radius = ringSteps[r];
      for (let i = 0; i < 16; i += 1) {
        const a = (Math.PI * 2 * i) / 16;
        const tx = Phaser.Math.Clamp(clampedX + Math.cos(a) * radius, minX, maxX);
        const ty = Phaser.Math.Clamp(clampedY + Math.sin(a) * radius, minY, maxY);
        if (this.isOnValidTerrain?.(tx, ty) !== false) {
          return { x: tx, y: ty };
        }
      }
    }

    return { x: clampedX, y: clampedY };
  },

  spawnBarrageLightningBolt: function (startX, startY, endX, endY) {
    if (!this.textures?.exists('lightningFrame1')) {
      return;
    }

    this.ensureLightningSpriteAnimations();

    const strikeX = endX + Phaser.Math.FloatBetween(-sx(6), sx(6));
    const topY = sy(76) + MAP_OFFSET_Y;
    const clampedEndY = Phaser.Math.Clamp(endY, topY + sy(70), BOARD_HEIGHT - sy(50));
    const distance = Math.max(sy(70), clampedEndY - topY);
    const heightMul = 0.68;
    const boltHeight = Math.max(sy(60), distance * heightMul);
    const midX = strikeX;
    const midY = clampedEndY - (boltHeight * 0.5);

    const frameImage = this.textures.get('lightningFrame1')?.getSourceImage();
    const frameWidth = Math.max(1, Number(frameImage?.width) || 72);
    const frameHeight = Math.max(1, Number(frameImage?.height) || 320);

    const displayHeight = boltHeight * Phaser.Math.FloatBetween(0.98, 1.05);
    const widthScale = Phaser.Math.FloatBetween(0.28, 0.42);
    const displayWidth = Math.max(sx(7), (frameWidth * (displayHeight / frameHeight)) * widthScale);

    const core = this.add.sprite(midX, midY, 'lightningFrame1')
      .setDisplaySize(displayWidth, displayHeight)
      .setRotation(0)
      .setDepth(8.6)
      .setAlpha(0.96)
      .setBlendMode(Phaser.BlendModes.ADD);

    this.spawnLightningBoltGroundCap(strikeX, clampedEndY);

    core.play('lightningBoltFull');

    core.once('animationcomplete', () => {
      if (core?.active) {
        core.destroy();
      }
    });
  },

  drawPath: function () {
    return drawGamePath.call(this);
  },

  tracePathPolyline: function (graphics, points) {
    if (!graphics || !Array.isArray(points) || points.length < 2) {
      return;
    }

    graphics.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      graphics.lineTo(points[i].x, points[i].y);
    }
  },

  buildOffsetPath: function (points, offset) {
    if (!Array.isArray(points) || points.length < 2) {
      return Array.isArray(points) ? points.map((p) => ({ x: p.x, y: p.y })) : [];
    }

    const shifted = [];
    for (let i = 0; i < points.length; i++) {
      const prev = points[Math.max(0, i - 1)];
      const next = points[Math.min(points.length - 1, i + 1)];
      const dx = next.x - prev.x;
      const dy = next.y - prev.y;
      const len = Math.hypot(dx, dy) || 1;
      const nx = -dy / len;
      const ny = dx / len;
      shifted.push({
        x: points[i].x + (nx * offset),
        y: points[i].y + (ny * offset),
      });
    }
    return shifted;
  },

  stampDirtRoad: function (graphics, points, radius, color, alpha, stepPx = 10, noise = 0.2, coverage = 1) {
    if (!graphics || !Array.isArray(points) || points.length < 2) {
      return;
    }

    for (let i = 1; i < points.length; i++) {
      const start = points[i - 1];
      const end = points[i];
      const dx = end.x - start.x;
      const dy = end.y - start.y;
      const segLen = Math.hypot(dx, dy);
      if (segLen <= 0) {
        continue;
      }

      const nx = -dy / segLen;
      const ny = dx / segLen;
      const steps = Math.max(1, Math.ceil(segLen / Math.max(2, stepPx)));

      for (let s = 0; s <= steps; s++) {
        const t = s / steps;
        const jitter = Math.sin((i * 1.37) + (s * 0.81)) * noise * radius;
        const widthShift = Math.sin((i * 0.57) + (s * 0.49)) * (1 - coverage) * radius * 0.35;
        const cx = start.x + (dx * t) + (nx * jitter * 0.45);
        const cy = start.y + (dy * t) + (ny * jitter * 0.45);
        const r = Math.max(1, radius + widthShift);

        graphics.fillStyle(color, alpha);
        graphics.fillCircle(cx, cy, r);
      }
    }
  },

  buildPlayableDirtRoadPath: function (points, options = {}) {
    if (!Array.isArray(points) || points.length < 2) {
      return Array.isArray(points) ? points.map((p) => ({ x: p.x, y: p.y })) : [];
    }

    const safeTop = Number.isFinite(options.safeTop) ? options.safeTop : (sy(110) + MAP_OFFSET_Y);
    const trayTop = BOARD_HEIGHT - sy(14) - sy(86);
    const safeBottomDefault = trayTop - sy(34);
    const safeBottom = Number.isFinite(options.safeBottom) ? options.safeBottom : safeBottomDefault;
    const minX = Number.isFinite(options.minX) ? options.minX : sx(24);
    const maxX = Number.isFinite(options.maxX) ? options.maxX : (BOARD_WIDTH - sx(24));
    const extraTurns = Phaser.Math.Clamp(options.extraTurns || 1.45, 0.8, 2.2);

    const withTurns = this.injectDirtRoadTurns(points, {
      safeTop,
      safeBottom,
      minX,
      maxX,
      extraTurns,
    });

    const smoothPath = this.buildDirtRoadPath(withTurns, 0.86, 18);
    if (smoothPath.length <= 0) {
      return withTurns;
    }

    const clampedPath = smoothPath.map((point) => ({
      x: Phaser.Math.Clamp(point.x, minX, maxX),
      y: Phaser.Math.Clamp(point.y, safeTop, safeBottom),
    }));

    clampedPath[0] = { ...withTurns[0] };
    clampedPath[clampedPath.length - 1] = { ...withTurns[withTurns.length - 1] };
    return clampedPath;
  },

  injectDirtRoadTurns: function (points, options = {}) {
    if (!Array.isArray(points) || points.length < 2) {
      return Array.isArray(points) ? points.map((p) => ({ x: p.x, y: p.y })) : [];
    }

    const safeTop = Number.isFinite(options.safeTop) ? options.safeTop : 0;
    const safeBottom = Number.isFinite(options.safeBottom) ? options.safeBottom : BOARD_HEIGHT;
    const minX = Number.isFinite(options.minX) ? options.minX : 0;
    const maxX = Number.isFinite(options.maxX) ? options.maxX : BOARD_WIDTH;
    const turnFactor = Phaser.Math.Clamp(options.extraTurns || 1.3, 0.8, 2.2);
    const minSegment = Math.max(18, sx(40));

    const enriched = [{ x: points[0].x, y: points[0].y }];

    for (let i = 0; i < points.length - 1; i++) {
      const start = points[i];
      const end = points[i + 1];
      const dx = end.x - start.x;
      const dy = end.y - start.y;
      const len = Math.hypot(dx, dy);

      if (len <= minSegment) {
        enriched.push({ x: end.x, y: end.y });
        continue;
      }

      const nx = -dy / len;
      const ny = dx / len;
      const insertCount = Math.min(3, Math.max(1, Math.floor((len / sx(120)) * turnFactor)));

      for (let k = 1; k <= insertCount; k++) {
        const t = k / (insertCount + 1);
        const baseX = Phaser.Math.Linear(start.x, end.x, t);
        const baseY = Phaser.Math.Linear(start.y, end.y, t);
        const waveSign = ((i + k) % 2 === 0) ? 1 : -1;
        const offsetMag = Math.min(len * 0.26, sx(64)) * waveSign;
        const taper = Math.sin(Math.PI * t);
        const turnJitter = Math.sin((i * 1.7) + (k * 2.1)) * sx(9);
        const bendX = baseX + (nx * (offsetMag * taper)) + (nx * turnJitter * 0.45);
        const bendY = baseY + (ny * (offsetMag * taper)) + (ny * turnJitter);

        enriched.push({
          x: Phaser.Math.Clamp(bendX, minX, maxX),
          y: Phaser.Math.Clamp(bendY, safeTop, safeBottom),
        });
      }

      enriched.push({ x: end.x, y: end.y });
    }

    enriched[0] = {
      x: Phaser.Math.Clamp(points[0].x, minX, maxX),
      y: Phaser.Math.Clamp(points[0].y, safeTop, safeBottom),
    };
    enriched[enriched.length - 1] = {
      x: Phaser.Math.Clamp(points[points.length - 1].x, minX, maxX),
      y: Phaser.Math.Clamp(points[points.length - 1].y, safeTop, safeBottom),
    };

    return enriched;
  },

  buildDirtRoadPath: function (points, smoothness = 0.75, samplesPerSegment = 12) {
    if (!Array.isArray(points) || points.length < 3) {
      return Array.isArray(points) ? points.map((p) => ({ x: p.x, y: p.y })) : [];
    }

    const path = [];
    const sampleCount = Math.max(4, Math.floor(samplesPerSegment));
    const blend = Phaser.Math.Clamp(smoothness, 0, 1);

    const catmull = (p0, p1, p2, p3, t) => {
      const t2 = t * t;
      const t3 = t2 * t;
      const x = 0.5 * (
        (2 * p1.x) +
        (-p0.x + p2.x) * t +
        (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
        (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3
      );
      const y = 0.5 * (
        (2 * p1.y) +
        (-p0.y + p2.y) * t +
        (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
        (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3
      );
      return { x, y };
    };

    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[Math.max(0, i - 1)];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[Math.min(points.length - 1, i + 2)];
      const startStep = i === 0 ? 0 : 1;

      for (let step = startStep; step < sampleCount; step++) {
        const t = step / sampleCount;
        const linearX = Phaser.Math.Linear(p1.x, p2.x, t);
        const linearY = Phaser.Math.Linear(p1.y, p2.y, t);
        const spline = catmull(p0, p1, p2, p3, t);
        path.push({
          x: Phaser.Math.Linear(linearX, spline.x, blend),
          y: Phaser.Math.Linear(linearY, spline.y, blend),
        });
      }
    }

    const last = points[points.length - 1];
    path.push({ x: last.x, y: last.y });
    return path;
  },

  drawTowerBases: function () {
    if (this.isFreePlacementEnabled()) {
      return;
    }

    if (!this.mapLayer || !this.towerStructures) {
      return;
    }

    this.towerStructures.forEach((structure) => {
      const base = this.add.image(structure.x, structure.y, structure.key)
        .setScale(0.82 * GAMEPLAY_VISUAL_SCALE * TOWER_BASE_VISUAL_SCALE_MULT)
        .setFlipX(!!structure.flipX)
        .setRotation(structure.rotation || 0)
        .setDepth(1.72);
      this.mapLayer.add(base);
    });

    if (this.towerBaseSlots) {
      this.towerBaseSlots.forEach((slot, index) => {
        if (slot.clickTarget) {
          slot.clickTarget.destroy();
        }
        if (slot.selectionRing) {
          slot.selectionRing.destroy();
        }

        const selectionRing = this.add.circle(slot.x, slot.y, sx(24) * TOWER_BASE_VISUAL_SCALE_MULT, 0x7bf7ff, 0.05)
          .setStrokeStyle(2, 0x7bf7ff, 0.18)
          .setDepth(1.9);
        const clickTarget = this.add.circle(slot.x, slot.y, sx(28) * TOWER_BASE_VISUAL_SCALE_MULT, 0x000000, 0.001)
          .setDepth(1.91)
          .setInteractive({ useHandCursor: true });

        clickTarget.on('pointerdown', () => {
          if (!this.selectedTowerDef) {
            this.setStatus('Select a weapon from the loadout HUD first.', '#ffb18b');
            return;
          }

          this.setStatus('Drag the selected weapon from the left module badge onto a tower.', '#9ad8ee');
        });

        slot.selectionRing = selectionRing;
        slot.clickTarget = clickTarget;
        this.mapLayer.add(selectionRing);

        const label = this.add.text(slot.x, slot.y - sy(2), String(index + 1), {
          fontFamily: 'Trebuchet MS',
          fontSize: '18px',
          color: '#f4fbff',
          stroke: '#161d25',
          strokeThickness: 3,
          fontStyle: 'bold',
        })
          .setOrigin(0.5)
          .setDepth(1.95)
          .setAlpha(0.95);
        this.mapLayer.add(label);
      });

      this.updateTowerBaseIndicators();
    }
  },

  setupUI: function () {
    return setupGameUI.call(this);
  },

  setupHtmlHudOverlay: function () {
    if (!this.useHtmlHudOverlay || typeof document === 'undefined') {
      return;
    }

    if (this.htmlHudRoot?.isConnected) {
      this.syncHtmlHudOverlayBounds();
      this.updateHtmlHudValues();
      return;
    }

    const mountParent = document.body;
    if (!mountParent) {
      return;
    }

    fetch('/hud.html')
      .then((response) => response.text())
      .then((markup) => {
        if (this.scene?.isDestroyed) {
          return;
        }

        if (this.htmlHudRoot?.isConnected) {
          this.htmlHudRoot.remove();
        }

        const wrapper = document.createElement('div');
        wrapper.setAttribute('data-hud-overlay-root', 'true');
        wrapper.innerHTML = markup;
        mountParent.appendChild(wrapper);

        this.htmlHudRoot = wrapper;
        this.htmlHudOverlayNode = wrapper.querySelector('#ab-hud-overlay');
        if (this.htmlHudOverlayNode) {
          this.htmlHudOverlayNode.style.position = 'absolute';
          this.htmlHudOverlayNode.style.left = '0px';
          this.htmlHudOverlayNode.style.right = '0px';
          this.htmlHudOverlayNode.style.top = '0px';
          this.htmlHudOverlayNode.setAttribute('data-force-desktop', 'true');
          const platformMobile = Boolean(window?.__appPlatform?.isMobile);
          const narrowViewport = typeof window !== 'undefined' && window.matchMedia('(max-width: 900px)').matches;
          const compactLandscape = typeof window !== 'undefined' && window.matchMedia('(orientation: landscape) and (max-height: 500px)').matches;
          const coarsePointer = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;
          const useMobileHud = platformMobile || narrowViewport || (coarsePointer && compactLandscape);
          this.htmlHudOverlayNode.setAttribute('data-mobile', useMobileHud ? 'true' : 'false');
        }
        this.htmlHudValues = {
          commanderName: wrapper.querySelector('[data-hud="commander-name"]'),
          gold: wrapper.querySelector('[data-hud="gold"]'),
          goldKey: wrapper.querySelector('[data-hud="gold"]')?.parentElement?.querySelector('.stat-key') || null,
          tech: wrapper.querySelector('[data-hud="tech"]'),
          lives: wrapper.querySelector('[data-hud="lives"]'),
          wave: wrapper.querySelector('[data-hud="wave"]'),
          world: wrapper.querySelector('[data-hud="world"]'),
          level: wrapper.querySelector('[data-hud="level"]'),
          score: wrapper.querySelector('[data-hud="score"]'),
          status: wrapper.querySelector('[data-hud="status"]'),
          leaderboard: wrapper.querySelector('[data-hud="leaderboard"]'),
          protocolTitle: wrapper.querySelector('.protocol-title'),
          protocolCopy: wrapper.querySelector('.protocol-copy'),
          protocolMeta: wrapper.querySelector('.protocol-meta'),
        };
        this.htmlHudPauseButton = wrapper.querySelector('[data-hud-action="start-or-pause"]');

        wrapper.querySelector('[data-hud-action="start-or-pause"]')?.addEventListener('click', () => {
          if (this.gameState?.prepPhase && !this.gameState?.gameOver) {
            this.beginCombatPhase();
          } else {
            this.togglePlayerPause();
          }
        });
        wrapper.querySelector('[data-hud-action="restart"]')?.addEventListener('click', () => this.restartFromHud());
        wrapper.querySelector('[data-hud-action="modal"]')?.addEventListener('click', () => this.rerunWaveClearModalPreview());
        wrapper.querySelector('[data-hud-action="settings"]')?.addEventListener('click', () => this.toggleAudioSettingsPanel());
        wrapper.querySelector('[data-hud-action="home"]')?.addEventListener('click', () => this.returnToWorldSelectFromHud());

        if (!this.htmlHudResizeHandler && typeof window !== 'undefined') {
          this.htmlHudResizeHandler = () => this.syncHtmlHudOverlayBounds();
          window.addEventListener('resize', this.htmlHudResizeHandler);
        }
        if (!this.htmlHudScaleResizeHandler && this.scale) {
          this.htmlHudScaleResizeHandler = () => this.syncHtmlHudOverlayBounds();
          this.scale.on('resize', this.htmlHudScaleResizeHandler);
        }

        this.updatePauseHudButton();
        this.syncHtmlHudOverlayBounds();
        this.updateHtmlHudValues();
      })
      .catch(() => {
        // Keep Phaser HUD as fallback when template cannot be loaded.
        this.useHtmlHudOverlay = false;
        this.setPhaserTopHudVisible(true);
      });
  },

  setupHtmlWaveClearOverlay: function () {
    if (typeof document === 'undefined') {
      return Promise.resolve(false);
    }

    if (this.htmlWaveClearRoot?.isConnected && this.htmlWaveClearOverlayNode) {
      this.syncHtmlHudOverlayBounds();
      return Promise.resolve(true);
    }

    if (this.htmlWaveClearMountPromise) {
      return this.htmlWaveClearMountPromise;
    }

    this.htmlWaveClearMountPromise = fetch('/wave-cleared-modal.html')
      .then((response) => response.text())
      .then((markup) => {
        if (this.scene?.isDestroyed) {
          return false;
        }

        if (this.htmlWaveClearRoot?.isConnected) {
          this.htmlWaveClearRoot.remove();
        }

        const wrapper = document.createElement('div');
        wrapper.setAttribute('data-wave-clear-root', 'true');
        wrapper.style.pointerEvents = 'none';
        wrapper.innerHTML = markup;
        document.body.appendChild(wrapper);

        this.htmlWaveClearRoot = wrapper;
        this.htmlWaveClearOverlayNode = wrapper.querySelector('#wave-clear-overlay');
        // Overlay itself handles pointer events when visible
        if (this.htmlWaveClearOverlayNode) {
          this.htmlWaveClearOverlayNode.style.pointerEvents = 'auto';
        }
        this.htmlWaveClearElements = {
          title: wrapper.querySelector('[data-wave-clear="title"]'),
          subtitle: wrapper.querySelector('[data-wave-clear="subtitle"]'),
          levelChip: wrapper.querySelector('[data-wave-clear="level-chip"]'),
          playerLevel: wrapper.querySelector('[data-wave-clear="player-level"]'),
          rewardSupplies: wrapper.querySelector('[data-wave-clear="reward-supplies"]'),
          rewardGold: wrapper.querySelector('[data-wave-clear="reward-gold"]'),
          rewardXp: wrapper.querySelector('[data-wave-clear="reward-xp"]'),
          statEnemies: wrapper.querySelector('[data-wave-clear="stat-enemies"]'),
          statDamage: wrapper.querySelector('[data-wave-clear="stat-damage"]'),
          statTowers: wrapper.querySelector('[data-wave-clear="stat-towers"]'),
          statTime: wrapper.querySelector('[data-wave-clear="stat-time"]'),
          actionsRow: wrapper.querySelector('.wc-actions'),
          confetti: wrapper.querySelector('[data-wave-clear="confetti"]'),
          replayButton: wrapper.querySelector('[data-wave-clear-action="replay"]'),
          continueButton: wrapper.querySelector('[data-wave-clear-action="continue"]'),
          homeButton: wrapper.querySelector('[data-wave-clear-action="home"]'),
          unlockOverlay: wrapper.querySelector('[data-wave-clear="unlock-overlay"]'),
          unlockWeaponImage: wrapper.querySelector('[data-wave-clear="unlock-weapon-image"]'),
          unlockPlaceholder: wrapper.querySelector('[data-wave-clear="unlock-placeholder"]'),
          unlockWeaponName: wrapper.querySelector('[data-wave-clear="unlock-weapon-name"]'),
          unlockWeaponRole: wrapper.querySelector('[data-wave-clear="unlock-weapon-role"]'),
          unlockWeaponDesc: wrapper.querySelector('[data-wave-clear="unlock-weapon-desc"]'),
          unlockStatDamageValue: wrapper.querySelector('[data-wave-clear="unlock-stat-damage-value"]'),
          unlockStatRangeValue: wrapper.querySelector('[data-wave-clear="unlock-stat-range-value"]'),
          unlockStatFireRateValue: wrapper.querySelector('[data-wave-clear="unlock-stat-fire-rate-value"]'),
          unlockStatDpsValue: wrapper.querySelector('[data-wave-clear="unlock-stat-dps-value"]'),
          unlockStatAoeValue: wrapper.querySelector('[data-wave-clear="unlock-stat-aoe-value"]'),
          unlockStatDamageFill: wrapper.querySelector('[data-wave-clear="unlock-stat-damage-fill"]'),
          unlockStatRangeFill: wrapper.querySelector('[data-wave-clear="unlock-stat-range-fill"]'),
          unlockStatFireRateFill: wrapper.querySelector('[data-wave-clear="unlock-stat-fire-rate-fill"]'),
          unlockStatDpsFill: wrapper.querySelector('[data-wave-clear="unlock-stat-dps-fill"]'),
          unlockStatAoeFill: wrapper.querySelector('[data-wave-clear="unlock-stat-aoe-fill"]'),
          claimUnlockButton: wrapper.querySelector('[data-wave-clear-action="claim-unlock"]'),
        };

        if (!this.htmlWaveClearOverlayNode) {
          return false;
        }

        this.htmlWaveClearOverlayNode.style.display = 'none';
        if (this.htmlWaveClearRoot) {
          this.htmlWaveClearRoot.style.pointerEvents = 'none';
        }
        this.syncHtmlHudOverlayBounds();
        return true;
      })
      .catch(() => false)
      .finally(() => {
        this.htmlWaveClearMountPromise = null;
      });

    return this.htmlWaveClearMountPromise;
  },

  setupHtmlWeaponTray: function () {
    if (!this.useHtmlWeaponTray || typeof document === 'undefined') return;
    window.__tdScene = this;
    window.__toggleBlueprintOverlay = (forceOpen = null) => {
      if (this?.toggleBlueprintOverlay) {
        this.toggleBlueprintOverlay(forceOpen);
      }
    };
    window.__deployAllyUnit = (unitId) => this.deployAllyUnit(unitId);

    if (this.htmlWeaponTrayRoot?.isConnected) {
      this.syncHtmlWeaponTrayBounds();
      if (typeof window.__setHtmlTrayVisible === 'function') window.__setHtmlTrayVisible(true);
      return;
    }
    fetch('/weapon-tray.html')
      .then((r) => r.text())
      .then((markup) => {
        if (this.scene?.isDestroyed) return;
        if (this.htmlWeaponTrayRoot?.isConnected) this.htmlWeaponTrayRoot.remove();

        const wrapper = document.createElement('div');
        wrapper.setAttribute('data-weapon-tray-root', 'true');

        // Strip <script> tags, set HTML via innerHTML (safe, no script execution)
        const cleanMarkup = markup.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
        wrapper.innerHTML = cleanMarkup;
        document.body.appendChild(wrapper);
        this.htmlWeaponTrayRoot = wrapper;

        // Re-execute each script block after DOM is live
        const scriptRe = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
        let m;
        while ((m = scriptRe.exec(markup)) !== null) {
          const ns = document.createElement('script');
          ns.text = m[1];
          document.body.appendChild(ns);
        }

        this.syncHtmlWeaponTrayBounds();
        if (typeof window.__setHtmlTrayVisible === 'function') window.__setHtmlTrayVisible(true);
        if (!this.htmlTrayResizeHandler) {
          this.htmlTrayResizeHandler = () => this.syncHtmlWeaponTrayBounds();
          window.addEventListener('resize', this.htmlTrayResizeHandler);
          if (this.scale) this.scale.on('resize', this.htmlTrayResizeHandler);
        }
        // Initial population
        this.renderWeaponCarousel();
        const defToShow = this.selectedTowerDef || this.towerCatalog?.[0];
        if (defToShow) this._notifyHtmlTrayDetail(defToShow);
      })
      .catch(() => { this.useHtmlWeaponTray = false; });
  },

  syncHtmlWeaponTrayBounds: function () {
    if (!this.htmlWeaponTrayRoot || !this.game?.canvas) return;
    const rect   = this.game.canvas.getBoundingClientRect();
    const trayEl = this.htmlWeaponTrayRoot.querySelector('#ht-weapon-tray');
    if (!trayEl) return;
    // Limit the interactive wrapper to the bottom tray band so touch hit-testing
    // stays reliable on mobile/webview while gameplay area remains unobstructed.
    const trayHeight = Math.max(1, trayEl.offsetHeight || 100);
    const topBuffer = 120; // room for remove button above tray
    const wrapperTop = rect.top + rect.height - (trayHeight + topBuffer);
    this.htmlWeaponTrayRoot.style.cssText = [
      'position:fixed',
      'left:' + Math.round(rect.left) + 'px',
      'top:' + Math.round(wrapperTop) + 'px',
      'width:' + Math.round(rect.width) + 'px',
      'height:' + Math.round(trayHeight + topBuffer) + 'px',
      'overflow:visible',
      'pointer-events:auto',
      'z-index:230',
    ].join(';');
    trayEl.style.pointerEvents = 'auto';
  },

  _notifyHtmlTrayDetail: function (towerDef) {
    if (!towerDef || typeof window.__updateHtmlTrayDetail !== 'function') return;
    const hitPowerValue = towerDef.baseDamage || towerDef.damage || 0;
    const powerTierLabel = towerDef.powerTierLabel || (this.getWeaponPowerTierInfo ? this.getWeaponPowerTierInfo(hitPowerValue).label : '');
    const pattern = towerDef.firePattern || 'single';
    const fireClass = (pattern === 'laser' || pattern === 'lance') ? 'Laser' : pattern === 'pulsar' ? 'Pulsar' : 'Ballistic';
    const rangeLabel = towerDef.range < TOWER_RANGE * 0.9 ? 'Short range' : towerDef.range > TOWER_RANGE * 1.28 ? 'Long range' : 'Medium range';
    const fireLabel = towerDef.fireRate <= 380 ? 'Rapid fire' : towerDef.fireRate <= 650 ? 'Steady fire' : 'Heavy shots';
    const tier = Math.max(1, Number(towerDef.blueprintTier) || Math.floor(((towerDef.id || 1) - 1) / 4) + 1);
    window.__updateHtmlTrayDetail({
      weaponId: towerDef.id,
      assetPath: (window.WEAPON_LIBRARY_MAP || {})[towerDef.id]?.assetPath || '',
      name: towerDef.name + ' · T' + tier,
      _roleText: 'Class: ' + fireClass + '  |  ' + powerTierLabel + '  |  ' + rangeLabel + ' • ' + fireLabel,
      _statsText: 'Best use: ' + (towerDef.role || 'General-purpose') + '\nHit power: ' + hitPowerValue.toFixed(2) + '  |  Cost ' + towerDef.cost,
    });
  },

  syncHtmlHudOverlayBounds: function () {
    if (!this.game?.canvas) {
      return;
    }

    const rect = this.game.canvas.getBoundingClientRect();
    const width = Math.max(1, rect.width);
    const widthScale = width / BOARD_WIDTH;

    const applyCanvasOverlayBounds = (rootNode, zIndex, pointerEvents, options = {}) => {
      if (!rootNode) {
        return;
      }
      const scale = Number.isFinite(options.scale) ? options.scale : widthScale;
      const centerX = options.centerX === true;
      const centerY = options.centerY === true;
      const scaledWidth = BOARD_WIDTH * scale;
      const scaledHeight = BOARD_HEIGHT * scale;
      const left = centerX
        ? rect.left + ((rect.width - scaledWidth) / 2)
        : rect.left;
      const top = centerY
        ? rect.top + ((rect.height - scaledHeight) / 2)
        : rect.top;
      rootNode.style.position = 'fixed';
      rootNode.style.left = Math.round(left) + 'px';
      rootNode.style.top = Math.round(top) + 'px';
      rootNode.style.width = BOARD_WIDTH + 'px';
      rootNode.style.height = BOARD_HEIGHT + 'px';
      rootNode.style.transformOrigin = 'top left';
      rootNode.style.transform = 'scale(' + scale.toFixed(4) + ')';
      rootNode.style.pointerEvents = pointerEvents;
      rootNode.style.zIndex = zIndex;
    };

    if (this.htmlHudRoot && this.htmlHudOverlayNode) {
      applyCanvasOverlayBounds(this.htmlHudRoot, '220', 'none', { scale: widthScale, centerX: false, centerY: false });
    }
    const platformMobile = Boolean(window?.__appPlatform?.isMobile);
    const narrowViewport = typeof window !== 'undefined' && window.matchMedia('(max-width: 900px)').matches;
    const compactLandscape = typeof window !== 'undefined' && window.matchMedia('(orientation: landscape) and (max-height: 500px)').matches;
    const coarsePointer = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;
    const useMobileHud = platformMobile || narrowViewport || (coarsePointer && compactLandscape);
    if (this.htmlHudOverlayNode) {
      this.htmlHudOverlayNode.setAttribute('data-mobile', useMobileHud ? 'true' : 'false');
      this.htmlHudOverlayNode.setAttribute('data-compact', 'false');
      this.htmlHudOverlayNode.setAttribute('data-narrow', 'false');
    }

    if (this.htmlWaveClearRoot?.isConnected) {
      // Use 'none' on the root wrapper so it never blocks game clicks when the overlay is hidden.
      // The overlay child (#wave-clear-overlay) has pointer-events:auto set inline when visible.
      applyCanvasOverlayBounds(this.htmlWaveClearRoot, '320', 'none', { scale: widthScale, centerX: false, centerY: true });
    }

    if (this.htmlMultiplayerRoot?.isConnected) {
      applyCanvasOverlayBounds(this.htmlMultiplayerRoot, '300', 'none', { scale: widthScale, centerX: false, centerY: false });
    }
  },

  teardownHtmlHudOverlay: function () {
    if (this.htmlHudResizeHandler && typeof window !== 'undefined') {
      window.removeEventListener('resize', this.htmlHudResizeHandler);
    }
    if (this.htmlHudScaleResizeHandler && this.scale) {
      this.scale.off('resize', this.htmlHudScaleResizeHandler);
    }
    this.htmlHudResizeHandler = null;
    this.htmlHudScaleResizeHandler = null;

    if (this.htmlHudRoot?.isConnected) {
      this.htmlHudRoot.remove();
    }
    this.htmlHudRoot = null;
    this.htmlHudOverlayNode = null;
    this.htmlHudValues = null;
    this.htmlHudPauseButton = null;

    if (this.htmlWaveClearRoot?.isConnected) {
      this.htmlWaveClearRoot.remove();
    }
    this.detachWaveTransitionWeaponInteraction();
    this.htmlWaveClearRoot = null;
    this.htmlWaveClearOverlayNode = null;
    this.htmlWaveClearElements = null;
    this.htmlWaveClearMountPromise = null;

    if (this.htmlTrayResizeHandler && typeof window !== 'undefined') {
      window.removeEventListener('resize', this.htmlTrayResizeHandler);
    }
    if (this.htmlTrayResizeHandler && this.scale) {
      this.scale.off('resize', this.htmlTrayResizeHandler);
    }
    this.htmlTrayResizeHandler = null;

    if (typeof window !== 'undefined' && typeof window.__setHtmlTrayVisible === 'function') {
      window.__setHtmlTrayVisible(false);
    }
    if (this.htmlWeaponTrayRoot?.isConnected) {
      this.htmlWeaponTrayRoot.remove();
    }
    this.htmlWeaponTrayRoot = null;
  },

  formatWaveTransitionDuration: function (durationMs = 0) {
    const totalSeconds = Math.max(0, Math.round((Number(durationMs) || 0) / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0');
  },

  buildWaveTransitionSummary: function (completedWave, nextWaveNumber, awardedGold) {
    const activeTowerCount = this.towers?.children?.entries?.filter((tower) => tower?.active).length || 0;
    const towerCapacity = Array.isArray(this.towerBaseSlots) && this.towerBaseSlots.length > 0
      ? this.towerBaseSlots.length
      : activeTowerCount;
    const elapsedMs = Math.max(0, ((this.time?.now || 0) - Number(this.waveStartedAtMs || 0)));
    const worldCleared = completedWave >= 10;
    const rewardsXp = COMMANDER_XP_PER_WAVE + (worldCleared ? COMMANDER_XP_PER_CLEAR : 0);
    const playerLevel = Math.max(1, Number(this.getEffectivePlayerLevel?.() || 1));
    const leveledUp = !DEBUG_FLAGS.developerUnlocksMaxed
      && completedWave > 0
      && (completedWave % WAVES_PER_PLAYER_LEVEL) === 0;
    const unlockedWeapon = this.getUnlockedWeaponForWaveTransition(playerLevel, leveledUp);

    return {
      completedWave,
      nextWaveNumber,
      worldCleared,
      playerLevel,
      leveledUp,
      unlockedWeapon,
      rewards: {
        supplies: Math.max(0, Number(this.waveSuppliesEarned || 0)),
        gold: Math.max(0, Number(awardedGold || 0)),
        xp: rewardsXp,
      },
      stats: {
        enemiesDestroyed: Math.max(0, Number(this.enemiesDefeated || 0)),
        damageDealt: Math.max(0, Math.round(Number(this.waveDamageDealt || 0))),
        towersRemaining: towerCapacity > 0 ? (activeTowerCount + '/' + towerCapacity) : String(activeTowerCount),
        timeTaken: this.formatWaveTransitionDuration(elapsedMs),
      },
    };
  },

  getUnlockedWeaponForWaveTransition: function (playerLevel, leveledUp) {
    if (!leveledUp || !Array.isArray(this.towerCatalog) || !this.towerCatalog.length) {
      return null;
    }

    const currentLevel = Math.max(1, Number(playerLevel || this.getEffectivePlayerLevel?.() || 1));
    const previousLevel = Math.max(1, currentLevel - 1);
    const newlyUnlocked = this.towerCatalog
      .filter((towerDef) => {
        const unlockLevel = Math.max(1, Number(towerDef?.unlockLevel || 1));
        return unlockLevel > previousLevel && unlockLevel <= currentLevel;
      })
      .sort((a, b) => {
        const levelDiff = (a.unlockLevel || 1) - (b.unlockLevel || 1);
        if (levelDiff !== 0) {
          return levelDiff;
        }
        return (a.id || 0) - (b.id || 0);
      });

    const weapon = newlyUnlocked[0] || null;
    if (!weapon) {
      return null;
    }

    const damage = Math.max(0, Number(weapon.baseDamage || weapon.damage || 0));
    const range = Math.max(0, Number(weapon.range || 0));
    const fireRatePerSec = weapon.fireRate > 0 ? (1000 / Number(weapon.fireRate)) : 0;
    const dps = damage * fireRatePerSec;
    const aoe = Math.max(0, Number(weapon.splashRadius || weapon.rocketSplashRadius || weapon.laserLaneRadius || 0));

    return {
      id: weapon.id,
      name: weapon.name || 'Unknown Weapon',
      role: (weapon.role || 'Rare Weapon').toUpperCase(),
      description: weapon.description || 'A newly unlocked weapon is now available in your loadout.',
      assetPath: weapon.assetPath || '',
      textureKey: weapon.key || '',
      stats: {
        damage,
        range,
        fireRate: fireRatePerSec,
        dps,
        aoe,
      },
    };
  },

  getWaveTransitionWeaponImageSrc: function (unlockedWeapon) {
    if (!unlockedWeapon) {
      return '';
    }

    const textureKey = String(unlockedWeapon.textureKey || '').trim();
    if (textureKey && this.textures?.exists?.(textureKey)) {
      const frame = this.textures.getFrame(textureKey);
      const sourceImage = frame?.source?.image || frame?.source?.sourceImage || frame?.texture?.getSourceImage?.();
      if (frame && sourceImage && typeof document !== 'undefined') {
        const cutX = Math.max(0, Math.floor(frame.cutX || 0));
        const cutY = Math.max(0, Math.floor(frame.cutY || 0));
        const cutWidth = Math.max(1, Math.floor(frame.cutWidth || frame.width || sourceImage.width || 1));
        const cutHeight = Math.max(1, Math.floor(frame.cutHeight || frame.height || sourceImage.height || 1));

        const canvas = document.createElement('canvas');
        canvas.width = cutWidth;
        canvas.height = cutHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, cutWidth, cutHeight);
          ctx.drawImage(sourceImage, cutX, cutY, cutWidth, cutHeight, 0, 0, cutWidth, cutHeight);
          return canvas.toDataURL('image/png');
        }
      }
    }

    return '';
  },

  getWaveTransitionStatFillPercent: function (value, maxValue) {
    const safeValue = Math.max(0, Number(value) || 0);
    const safeMax = Math.max(1, Number(maxValue) || 1);
    return Math.max(4, Math.min(100, (safeValue / safeMax) * 100));
  },

  setWaveTransitionUnlockStatLine: function (valueNode, fillNode, value, formatter, maxValue) {
    if (valueNode) {
      valueNode.textContent = typeof formatter === 'function' ? formatter(value) : String(value);
    }
    if (fillNode) {
      fillNode.style.setProperty('--fill', this.getWaveTransitionStatFillPercent(value, maxValue).toFixed(1) + '%');
    }
  },

  populateWaveTransitionUnlockCard: function (unlockedWeapon, revealNow = false) {
    const elements = this.htmlWaveClearElements;
    if (!elements?.unlockOverlay) {
      return;
    }

    if (!unlockedWeapon) {
      elements.unlockOverlay.classList.remove('is-visible');
      elements.unlockOverlay.setAttribute('aria-hidden', 'true');
      this.detachWaveTransitionWeaponInteraction();
      return;
    }

    if (elements.unlockWeaponName) elements.unlockWeaponName.textContent = unlockedWeapon.name || 'Unknown Weapon';
    if (elements.unlockWeaponRole) elements.unlockWeaponRole.textContent = unlockedWeapon.role || 'Rare Weapon';
    if (elements.unlockWeaponDesc) elements.unlockWeaponDesc.textContent = unlockedWeapon.description || '';

    const stripPath = String(unlockedWeapon.assetPath || '').trim();
    const imagePath = this.getWaveTransitionWeaponImageSrc(unlockedWeapon);
    if (elements.unlockWeaponImage) {
      if (stripPath || imagePath) {
        if (stripPath) {
          elements.unlockWeaponImage.style.backgroundImage = 'url(/' + stripPath + ')';
          elements.unlockWeaponImage.style.backgroundSize = 'auto 100%';
          elements.unlockWeaponImage.style.backgroundPosition = '0 0';
        } else {
          elements.unlockWeaponImage.style.backgroundImage = 'url(' + imagePath + ')';
          elements.unlockWeaponImage.style.backgroundSize = 'contain';
          elements.unlockWeaponImage.style.backgroundPosition = 'center';
        }
        elements.unlockWeaponImage.classList.remove('is-hidden');
        this.attachWaveTransitionWeaponInteraction(elements.unlockWeaponImage);
        if (elements.unlockPlaceholder) elements.unlockPlaceholder.classList.add('wc-hidden');
      } else {
        elements.unlockWeaponImage.style.backgroundImage = 'none';
        elements.unlockWeaponImage.classList.add('is-hidden');
        this.detachWaveTransitionWeaponInteraction();
        if (elements.unlockPlaceholder) elements.unlockPlaceholder.classList.remove('wc-hidden');
      }
    }

    const stats = unlockedWeapon.stats || {};
    const formatInt = (v) => new Intl.NumberFormat('en-US').format(Math.round(Math.max(0, Number(v) || 0)));
    const formatFixed = (v) => (Math.max(0, Number(v) || 0)).toFixed(2);

    this.setWaveTransitionUnlockStatLine(elements.unlockStatDamageValue, elements.unlockStatDamageFill, stats.damage, formatInt, 650);
    this.setWaveTransitionUnlockStatLine(elements.unlockStatRangeValue, elements.unlockStatRangeFill, stats.range, formatFixed, 520);
    this.setWaveTransitionUnlockStatLine(elements.unlockStatFireRateValue, elements.unlockStatFireRateFill, stats.fireRate, formatFixed, 6.5);
    this.setWaveTransitionUnlockStatLine(elements.unlockStatDpsValue, elements.unlockStatDpsFill, stats.dps, formatFixed, 2800);
    this.setWaveTransitionUnlockStatLine(elements.unlockStatAoeValue, elements.unlockStatAoeFill, stats.aoe, formatInt, 260);

    if (revealNow) {
      elements.unlockOverlay.classList.add('is-visible');
      elements.unlockOverlay.setAttribute('aria-hidden', 'false');
    } else {
      elements.unlockOverlay.classList.remove('is-visible');
      elements.unlockOverlay.setAttribute('aria-hidden', 'true');
    }
  },

  getWaveTransitionUnlockRevealDelayMs: function (summary) {
    const titleText = summary?.worldCleared ? 'WORLD CLEARED!' : 'WAVE CLEARED!';
    const titleDurationMs = 180 + ((Math.max(0, titleText.replace(/\s+/g, '').length - 1)) * 95) + 980;
    return titleDurationMs + 2280;
  },

  attachWaveTransitionWeaponInteraction: function (imageNode) {
    if (!imageNode || typeof window === 'undefined') {
      return;
    }

    if (this.waveTransitionWeaponInteractionCleanup) {
      const sameNode = this.waveTransitionWeaponInteractionNode === imageNode;
      if (sameNode) {
        return;
      }
      this.detachWaveTransitionWeaponInteraction();
    }

    const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
    const state = {
      active: false,
      pointerId: null,
      lastX: 0,
      lastY: 0,
      spinX: 0,
      spinY: 0,
      rotX: 0,
      rotY: 0,
      idleYaw: 0,
      rafId: 0,
      lastTick: 0,
    };

    const IDLE_YAW_SPEED_DEG_PER_FRAME = 0;

    const applyTransform = () => {
      const yaw = state.idleYaw + state.rotY;
      imageNode.style.transform = 'perspective(820px) rotateX(' + state.rotX.toFixed(2) + 'deg) rotateY(' + yaw.toFixed(2) + 'deg) scale(1.14)';
      imageNode.style.filter = 'none';
    };

    const animate = (timestamp) => {
      const tick = typeof timestamp === 'number' ? timestamp : performance.now();
      const dt = state.lastTick > 0 ? Math.max(0.8, Math.min(2.4, (tick - state.lastTick) / 16.6667)) : 1;
      state.lastTick = tick;

      if (!state.active) {
        state.idleYaw += (IDLE_YAW_SPEED_DEG_PER_FRAME * dt);
        state.rotX = (state.rotX + (state.spinX * dt)) * (1 - (0.035 * dt));
        state.rotY = (state.rotY + (state.spinY * dt)) * (1 - (0.035 * dt));
        state.spinX *= (1 - (0.085 * dt));
        state.spinY *= (1 - (0.085 * dt));

        // Return toward neutral so it does not stay permanently tilted.
        state.rotX *= (1 - (0.055 * dt));
        state.rotY *= (1 - (0.055 * dt));
      }

      state.rotX = clamp(state.rotX, -24, 24);
      state.rotY = clamp(state.rotY, -30, 30);
      applyTransform();
      state.rafId = window.requestAnimationFrame(animate);
    };

    const ensureAnimation = () => {
      if (!state.rafId) {
        state.rafId = window.requestAnimationFrame(animate);
      }
    };

    const start = (clientX, clientY, pointerId = null) => {
      state.active = true;
      state.pointerId = pointerId;
      state.lastX = clientX;
      state.lastY = clientY;
      imageNode.classList.add('is-interacting');
      ensureAnimation();
    };

    const move = (clientX, clientY) => {
      if (!state.active) {
        return;
      }

      const dx = clientX - state.lastX;
      const dy = clientY - state.lastY;
      state.lastX = clientX;
      state.lastY = clientY;

      state.rotY = clamp(state.rotY + (dx * 0.24), -30, 30);
      state.rotX = clamp(state.rotX - (dy * 0.24), -24, 24);
      state.spinY = clamp(dx * 0.075, -1.2, 1.2);
      state.spinX = clamp(-dy * 0.075, -1.2, 1.2);
      applyTransform();
    };

    const end = () => {
      if (!state.active) {
        return;
      }
      state.active = false;
      state.pointerId = null;
      imageNode.classList.remove('is-interacting');
      ensureAnimation();
    };

    const onPointerDown = (event) => {
      if (event.pointerType === 'mouse' && event.button !== 0) {
        return;
      }
      event.preventDefault();
      imageNode.setPointerCapture?.(event.pointerId);
      start(event.clientX, event.clientY, event.pointerId);
    };

    const onPointerMove = (event) => {
      if (!state.active) {
        return;
      }
      if (state.pointerId !== null && event.pointerId !== state.pointerId) {
        return;
      }
      event.preventDefault();
      move(event.clientX, event.clientY);
    };

    const onPointerUp = (event) => {
      if (state.pointerId !== null && event.pointerId !== state.pointerId) {
        return;
      }
      end();
    };

    const onPointerCancel = () => {
      end();
    };

    const onDblClick = (event) => {
      event.preventDefault();
      state.spinY += 0.9;
      state.spinX -= 0.3;
      ensureAnimation();
    };

    imageNode.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove, { passive: false });
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerCancel);
    imageNode.addEventListener('dblclick', onDblClick);

    applyTransform();
    ensureAnimation();

    this.waveTransitionWeaponInteractionNode = imageNode;
    this.waveTransitionWeaponInteractionCleanup = () => {
      imageNode.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerCancel);
      imageNode.removeEventListener('dblclick', onDblClick);
      if (state.rafId) {
        window.cancelAnimationFrame(state.rafId);
      }
      imageNode.classList.remove('is-interacting');
      imageNode.style.transform = '';
      imageNode.style.filter = 'none';
    };
  },

  detachWaveTransitionWeaponInteraction: function () {
    if (this.waveTransitionWeaponInteractionCleanup) {
      this.waveTransitionWeaponInteractionCleanup();
    }
    this.waveTransitionWeaponInteractionCleanup = null;
    this.waveTransitionWeaponInteractionNode = null;
  },

  setWaveClearAnimatedTitle: function (text = '') {
    const titleNode = this.htmlWaveClearElements?.title;
    if (!titleNode) {
      return;
    }

    const chars = Array.from(String(text || ''));
    const markup = chars.map((char, index) => {
      const safeChar = char === ' ' ? '&nbsp;' : char;
      const extraClass = char === ' ' ? ' wc-space' : '';
      return '<span class="wc-title-letter' + extraClass + '" style="--wc-letter-delay:' + (index * 95) + 'ms">' + safeChar + '</span>';
    }).join('');

    titleNode.classList.remove('is-animating');
    titleNode.innerHTML = markup;
  },

  triggerWaveClearTitleAnimation: function () {
    const titleNode = this.htmlWaveClearElements?.title;
    if (!titleNode) {
      return;
    }

    titleNode.classList.remove('is-animating');
    void titleNode.offsetWidth;

    if (typeof window !== 'undefined' && typeof window.setTimeout === 'function') {
      window.setTimeout(() => {
        if (this.htmlWaveClearElements?.title === titleNode) {
          titleNode.classList.add('is-animating');
        }
      }, 180);
      return;
    }

    titleNode.classList.add('is-animating');
  },

  formatWaveClearCounterValue: function (kind, value, options = {}) {
    const safeValue = Math.max(0, Number(value) || 0);
    if (kind === 'time') {
      return options?.fallbackText || '00:00';
    }
    if (kind === 'towers') {
      return options?.fallbackText || String(value || '0');
    }
    const formatted = new Intl.NumberFormat('en-US').format(Math.round(safeValue));
    return options?.prefix ? (options.prefix + formatted) : formatted;
  },

  animateWaveClearCounter: function (node, targetValue, config = {}) {
    if (!node) {
      return;
    }

    const kind = config.kind || 'number';
    const durationMs = Math.max(300, Number(config.durationMs) || 1400);
    const prefix = config.prefix || '';
    const fallbackText = config.fallbackText || '';

    if (kind === 'time' || kind === 'towers') {
      node.textContent = fallbackText;
      return;
    }

    const endValue = Math.max(0, Number(targetValue) || 0);
    node.classList.add('is-counting');

    const startAt = (typeof performance !== 'undefined' ? performance.now() : Date.now());
    const step = (now) => {
      const current = typeof now === 'number' ? now : (typeof performance !== 'undefined' ? performance.now() : Date.now());
      const elapsed = current - startAt;
      const progress = Math.max(0, Math.min(1, elapsed / durationMs));
      const eased = 1 - Math.pow(1 - progress, 3);
      const nextValue = Math.round(endValue * eased);
      node.textContent = this.formatWaveClearCounterValue(kind, nextValue, { prefix, fallbackText });

      if (progress < 1) {
        requestAnimationFrame(step);
        return;
      }

      node.textContent = this.formatWaveClearCounterValue(kind, endValue, { prefix, fallbackText });
      node.classList.remove('is-counting');
    };

    node.textContent = this.formatWaveClearCounterValue(kind, 0, { prefix, fallbackText });
    requestAnimationFrame(step);
  },

  playWaveClearGamificationSequence: function (summary) {
    const elements = this.htmlWaveClearElements;
    if (!elements) {
      return;
    }

    const titleText = summary.worldCleared ? 'WORLD CLEARED!' : 'WAVE CLEARED!';
    const titleDurationMs = 180 + ((Math.max(0, titleText.replace(/\s+/g, '').length - 1)) * 95) + 980;
    const subtitleNode = elements.subtitle;
    const heroNode = subtitleNode?.closest('.wc-hero') || null;
    const rewardNodes = Array.from(this.htmlWaveClearOverlayNode?.querySelectorAll('.wc-reward') || []);
    const primaryButton = elements.continueButton || null;

    if (subtitleNode) {
      subtitleNode.classList.remove('is-stamped');
    }
    if (heroNode) {
      heroNode.classList.remove('is-stamp-shaking');
    }
    rewardNodes.forEach((node) => node.classList.remove('is-popped'));
    primaryButton?.classList.remove('is-win-pulsing');

    window.setTimeout(() => {
      subtitleNode?.classList.add('is-stamped');
      if (heroNode) {
        heroNode.classList.remove('is-stamp-shaking');
        void heroNode.offsetWidth;
        heroNode.classList.add('is-stamp-shaking');
      }
    }, titleDurationMs + 120);

    window.setTimeout(() => {
      rewardNodes.forEach((node, index) => {
        window.setTimeout(() => node.classList.add('is-popped'), index * 110);
      });
      primaryButton?.classList.add('is-win-pulsing');

      this.animateWaveClearCounter(elements.rewardSupplies, summary.rewards.supplies, {
        kind: 'number',
        prefix: '+',
        durationMs: 1500,
      });
      this.animateWaveClearCounter(elements.rewardGold, summary.rewards.gold, {
        kind: 'number',
        prefix: '+',
        durationMs: 1650,
      });
      this.animateWaveClearCounter(elements.rewardXp, summary.rewards.xp, {
        kind: 'number',
        prefix: '+',
        durationMs: 1800,
      });
      this.animateWaveClearCounter(elements.statEnemies, summary.stats.enemiesDestroyed, {
        kind: 'number',
        durationMs: 1450,
      });
      this.animateWaveClearCounter(elements.statDamage, summary.stats.damageDealt, {
        kind: 'number',
        durationMs: 1950,
      });
      this.animateWaveClearCounter(elements.statTowers, 0, {
        kind: 'towers',
        fallbackText: summary.stats.towersRemaining,
      });
      this.animateWaveClearCounter(elements.statTime, 0, {
        kind: 'time',
        fallbackText: summary.stats.timeTaken,
      });
    }, titleDurationMs + 300);
  },

  showHtmlWaveTransitionSplash: function (summary, onComplete) {
    return this.setupHtmlWaveClearOverlay().then((ready) => {
      if (!ready || !this.htmlWaveClearOverlayNode || !this.htmlWaveClearElements) {
        return false;
      }

      const { rewards, stats, worldCleared, nextWaveNumber, playerLevel, leveledUp, unlockedWeapon } = summary;
      const elements = this.htmlWaveClearElements;
      const title = summary?.titleText || (worldCleared ? 'WORLD CLEARED!' : 'WAVE CLEARED!');
      const subtitle = summary?.subtitleText || (worldCleared ? 'Sector Secured, Commander!' : 'Well Done, Commander!');
      const actionLabels = summary?.actionLabels || {};
      const actionVisibility = summary?.actionVisibility || {};

      this.setWaveClearAnimatedTitle(title);
      if (elements.subtitle) elements.subtitle.textContent = subtitle;
      if (elements.playerLevel) {
        elements.playerLevel.textContent = String(Math.max(1, Number(playerLevel || this.getEffectivePlayerLevel?.() || 1)));
      }
      if (elements.levelChip) {
        elements.levelChip.classList.remove('is-level-up');
        if (leveledUp) {
          void elements.levelChip.offsetWidth;
          elements.levelChip.classList.add('is-level-up');
        }
      }
      if (elements.rewardSupplies) elements.rewardSupplies.textContent = '+' + rewards.supplies;
      if (elements.rewardGold) elements.rewardGold.textContent = '+' + rewards.gold;
      if (elements.rewardXp) elements.rewardXp.textContent = '+' + rewards.xp;
      if (elements.statEnemies) elements.statEnemies.textContent = new Intl.NumberFormat('en-US').format(stats.enemiesDestroyed);
      if (elements.statDamage) elements.statDamage.textContent = new Intl.NumberFormat('en-US').format(stats.damageDealt);
      if (elements.statTowers) elements.statTowers.textContent = stats.towersRemaining;
      if (elements.statTime) elements.statTime.textContent = stats.timeTaken;
      if (elements.replayButton) {
        const replayLabel = actionLabels.replay || 'Replay Wave';
        elements.replayButton.innerHTML = replayLabel + ' <span class="wc-btn-icon">↻</span>';
        elements.replayButton.style.display = actionVisibility.replay === false ? 'none' : '';
      }
      if (elements.continueButton) {
        const continueLabel = actionLabels.continue || (worldCleared ? 'ADVANCE' : 'NEXT WAVE');
        elements.continueButton.innerHTML = continueLabel + ' <span class="wc-btn-icon">»</span>';
        elements.continueButton.style.display = actionVisibility.continue === false ? 'none' : '';
      }
      if (elements.homeButton) {
        const homeLabel = actionLabels.home || 'Main Menu';
        elements.homeButton.innerHTML = homeLabel + ' <span class="wc-btn-icon">⌂</span>';
        elements.homeButton.style.display = actionVisibility.home === false ? 'none' : '';
      }
      if (elements.actionsRow) {
        const visibleCount = [elements.replayButton, elements.continueButton, elements.homeButton]
          .filter((button) => button && button.style.display !== 'none').length;
        elements.actionsRow.classList.toggle('is-two', visibleCount === 2);
        elements.actionsRow.classList.toggle('is-one', visibleCount === 1);
      }
      if (this.waveTransitionUnlockRevealTimer) {
        window.clearTimeout(this.waveTransitionUnlockRevealTimer);
        this.waveTransitionUnlockRevealTimer = null;
      }
      this.populateWaveTransitionUnlockCard(unlockedWeapon, false);

      let resolved = false;
      const closeWithAction = (action) => {
        if (resolved) {
          return;
        }
        resolved = true;
        if (this._splashActionsUnlockTimer) {
          window.clearTimeout(this._splashActionsUnlockTimer);
          this._splashActionsUnlockTimer = null;
        }
        this.clearWaveTransitionConfetti();
        this.hideHtmlWaveTransitionSplash();
        if (typeof onComplete === 'function') {
          onComplete(action);
        }
      };

      if (elements.replayButton) elements.replayButton.onclick = () => closeWithAction('replay');
      if (elements.continueButton) elements.continueButton.onclick = () => closeWithAction('continue');
      if (elements.homeButton) elements.homeButton.onclick = () => closeWithAction('home');

      // Lock action buttons only when there is an unlock/continue reveal sequence.
      const actionButtons = [elements.replayButton, elements.continueButton, elements.homeButton].filter(Boolean);
      const lockSplashActions = () => actionButtons.forEach(btn => {
        btn.disabled = true;
        btn.style.opacity = '0.35';
        btn.style.pointerEvents = 'none';
      });
      const unlockSplashActions = () => actionButtons.forEach(btn => {
        btn.disabled = false;
        btn.style.opacity = '';
        btn.style.pointerEvents = '';
      });
      const hasUnlockSequence = !!(summary?.unlockedWeapon || (summary?.actionVisibility?.continue !== false));
      if (hasUnlockSequence) {
        lockSplashActions();
        const splashRevealDelay = this.getWaveTransitionUnlockRevealDelayMs(summary);
        this._splashActionsUnlockTimer = window.setTimeout(unlockSplashActions, splashRevealDelay + 1200);
      } else {
        unlockSplashActions();
      }
      if (elements.claimUnlockButton) {
        elements.claimUnlockButton.onclick = () => {
          if (elements.unlockOverlay) {
            elements.unlockOverlay.classList.remove('is-visible');
            elements.unlockOverlay.setAttribute('aria-hidden', 'true');
          }
          this.playUiButtonSfx?.('confirm');
        };
      }

      this.htmlWaveClearOverlayNode.style.display = 'block';
      if (this.htmlWaveClearRoot) {
        this.htmlWaveClearRoot.style.pointerEvents = '';
      }
      this.syncHtmlHudOverlayBounds();
      this.triggerWaveClearTitleAnimation();
      this.playWaveClearGamificationSequence(summary);
      if (unlockedWeapon) {
        const revealDelay = this.getWaveTransitionUnlockRevealDelayMs(summary);
        this.waveTransitionUnlockRevealTimer = window.setTimeout(() => {
          if (!this.htmlWaveClearOverlayNode || this.htmlWaveClearOverlayNode.style.display === 'none') {
            return;
          }
          this.populateWaveTransitionUnlockCard(unlockedWeapon, true);
        }, revealDelay);
      }
      if (!this.gameState?.gameOver) {
        this.stopAllActiveGameAudio();
        this.playWaveWinSfx(1, 0.92);
      }
      this.launchWaveTransitionConfetti();
      return true;
    });
  },

  hideHtmlWaveTransitionSplash: function () {
    console.log('[WAVE] hideHtmlWaveTransitionSplash called');
    if (!this.htmlWaveClearOverlayNode) {
      return;
    }
    if (this.waveTransitionUnlockRevealTimer) {
      window.clearTimeout(this.waveTransitionUnlockRevealTimer);
      this.waveTransitionUnlockRevealTimer = null;
    }
    this.detachWaveTransitionWeaponInteraction();
    this.htmlWaveClearOverlayNode.style.display = 'none';
    // Remove pointer-event blocking from the wrapper too
    if (this.htmlWaveClearRoot) {
      this.htmlWaveClearRoot.style.pointerEvents = 'none';
      console.log('[WAVE] wave-clear-root pointer-events set to none');
    }
  },

  rerunWaveClearModalPreview: function () {
    const completedWave = Math.max(1, Number(this.gameState?.wave || 1));
    const nextWaveNumber = completedWave + 1;
    const playerLevel = Math.max(2, Number(this.getEffectivePlayerLevel?.() || 1));
    const previewLeveledUp = true;
    const previewUnlockedWeapon = this.getUnlockedWeaponForWaveTransition(playerLevel, true)
      || this.getUnlockedWeaponForWaveTransition(playerLevel + 1, true)
      || this.getUnlockedWeaponForWaveTransition(2, true);
    const sampleSummary = {
      completedWave,
      nextWaveNumber,
      worldCleared: completedWave >= 10,
      playerLevel,
      leveledUp: previewLeveledUp,
      unlockedWeapon: previewUnlockedWeapon,
      rewards: {
        supplies: Math.max(0, Number(this.waveSuppliesEarned || 150)),
        gold: Math.max(0, Number(this.lastWaveCompletionGoldBonus || 250)),
        xp: COMMANDER_XP_PER_WAVE + (completedWave >= 10 ? COMMANDER_XP_PER_CLEAR : 0),
      },
      stats: {
        enemiesDestroyed: Math.max(0, Number(this.enemiesDefeated || 128)),
        damageDealt: Math.max(0, Math.round(Number(this.waveDamageDealt || 24560))),
        towersRemaining: (() => {
          const activeTowerCount = this.towers?.children?.entries?.filter((tower) => tower?.active).length || 0;
          const towerCapacity = Array.isArray(this.towerBaseSlots) && this.towerBaseSlots.length > 0
            ? this.towerBaseSlots.length
            : Math.max(activeTowerCount, 10);
          return towerCapacity > 0 ? (activeTowerCount + '/' + towerCapacity) : String(activeTowerCount);
        })(),
        timeTaken: this.formatWaveTransitionDuration(Math.max(0, ((this.time?.now || 0) - Number(this.waveStartedAtMs || 0)))) || '02:45',
      },
    };

    this.clearWaveTransitionConfetti();
    this.hideHtmlWaveTransitionSplash();
    this.showHtmlWaveTransitionSplash(sampleSummary, () => {});
  },

  setupBlueprintOverlay: function () {
    if (!this.useBlueprintOverlay || typeof document === 'undefined') {
      return;
    }

    if (this.blueprintOverlayRoot?.isConnected || this.blueprintOverlayMountPending) {
      return;
    }

    const mountParent = document.body;
    if (!mountParent) {
      return;
    }

    this.blueprintOverlayMountPending = true;

    fetch('/blueprints-overlay.html')
      .then((response) => response.text())
      .then((markup) => {
        if (this.scene?.isDestroyed) {
          return;
        }

        if (this.blueprintOverlayRoot?.isConnected) {
          this.blueprintOverlayRoot.remove();
        }

        const wrapper = document.createElement('div');
        wrapper.setAttribute('data-blueprints-overlay-root', 'true');
        wrapper.innerHTML = markup;
        mountParent.appendChild(wrapper);

        this.blueprintOverlayRoot = wrapper;

        const overlay = wrapper.querySelector('[data-blueprints-overlay="true"]');
        const backdrop = wrapper.querySelector('[data-blueprints-backdrop="true"]');
        const closeButton = wrapper.querySelector('[data-blueprints-close="true"]');
        const sheet = wrapper.querySelector('[data-blueprints-sheet="true"]');
        const iframe = wrapper.querySelector('.bp-iframe');

        if (IS_NATIVE && iframe) {
          iframe.setAttribute('srcdoc', BLUEPRINTS_EMBEDDED_HTML_WITH_BASE);
          // Do NOT set src after srcdoc on native — a JS-triggered src change
          // fires Capacitor's shouldOverrideUrlLoading and can cause the outer
          // WebView to navigate to the app root, triggering the splash screen.
        }

        sheet?.addEventListener('pointerdown', (event) => event.stopPropagation());
        backdrop?.addEventListener('click', () => this.toggleBlueprintOverlay(false));
        closeButton?.addEventListener('click', () => this.toggleBlueprintOverlay(false));

        if (this.blueprintOverlayPendingOpen !== null) {
          const pending = this.blueprintOverlayPendingOpen;
          this.blueprintOverlayPendingOpen = null;
          this.toggleBlueprintOverlay(pending);
        } else if (overlay) {
          overlay.classList.remove('is-open');
          overlay.classList.add('is-closed');
          overlay.setAttribute('aria-hidden', 'true');
          this.blueprintOverlayVisible = false;
          this.updateBlueprintChevronState();
        }
      })
      .catch(() => {
        this.useBlueprintOverlay = false;
        this.updateBlueprintChevronState();
      })
      .finally(() => {
        this.blueprintOverlayMountPending = false;
      });
  },

  teardownBlueprintOverlay: function () {
    if (this.blueprintOverlayRoot?.isConnected) {
      this.blueprintOverlayRoot.remove();
    }
    this.blueprintOverlayRoot = null;
    this.blueprintOverlayVisible = false;
    this.blueprintOverlayPendingOpen = null;
    this.blueprintReturnToSettingsOnClose = false;
    this.updateBlueprintChevronState();
  },

  updateBlueprintChevronState: function () {
    if (!this.blueprintChevronButton || !this.blueprintChevronLabel) {
      return;
    }

    // Chevron access is retired on both desktop and mobile.
    this.blueprintChevronButton.setVisible(false).setAlpha(0);
    this.blueprintChevronLabel.setVisible(false).setAlpha(0);
    if (this.blueprintChevronButton.disableInteractive) this.blueprintChevronButton.disableInteractive();
    if (this.blueprintChevronLabel.disableInteractive) this.blueprintChevronLabel.disableInteractive();
  },

  toggleBlueprintOverlay: function (forceOpen = null) {
    const worldSelectVisible = (() => {
      const ov = typeof document !== 'undefined' ? document.getElementById('world-select-overlay') : null;
      if (!ov) return false;
      if (ov.style.display && ov.style.display !== 'none') return true;
      try {
        return window.getComputedStyle(ov).display !== 'none';
      } catch (_) {
        return false;
      }
    })();

    if (!this.useBlueprintOverlay || (this.gameState?.gameOver && !worldSelectVisible)) {
      return;
    }

    if (!this.blueprintOverlayRoot?.isConnected) {
      this.blueprintOverlayPendingOpen = forceOpen === null ? true : !!forceOpen;
      this.setupBlueprintOverlay();
      return;
    }

    const overlay = this.blueprintOverlayRoot.querySelector('[data-blueprints-overlay="true"]');
    if (!overlay) {
      return;
    }

    const currentlyOpen = overlay.classList.contains('is-open');
    const shouldOpen = forceOpen === null ? !currentlyOpen : !!forceOpen;

    overlay.classList.toggle('is-open', shouldOpen);
    overlay.classList.toggle('is-closed', !shouldOpen);
    overlay.setAttribute('aria-hidden', shouldOpen ? 'false' : 'true');

    if (shouldOpen) {
      const iframe = this.blueprintOverlayRoot.querySelector('.bp-iframe');
      if (iframe) {
        // On native WebView, use srcdoc to avoid path/routing quirks that can
        // send iframe navigation to the app shell (splash screen).
        if (IS_NATIVE) {
          if (!iframe.getAttribute('srcdoc')) {
            iframe.setAttribute('srcdoc', BLUEPRINTS_EMBEDDED_HTML_WITH_BASE);
          }
          // Do NOT set src after srcdoc — see note in setupBlueprintOverlay.
        } else {
          const isAttackRole = (() => {
            if (this.gameState?.selectedMode === 'multiplayer' && this.gameState?.multiplayerRole === 'enemyCommander') {
              return true;
            }
            if (!worldSelectVisible) {
              return false;
            }
            try {
              const raw = localStorage.getItem('tdWorldSelectModePrefs');
              if (!raw) return false;
              const prefs = JSON.parse(raw);
              return prefs?.mode === 'multiplayer' && prefs?.multiplayerRole === 'enemyCommander';
            } catch (_) {
              return false;
            }
          })();
          const stableSrc = isAttackRole
            ? 'tower-blueprints.html?mode=attack'
            : 'tower-blueprints.html?mode=defense';
          const currentSrc = iframe.getAttribute('src') || '';
          if (!currentSrc
            || currentSrc === 'about:blank'
            || /(^|\/)index\.html($|[?#])/.test(currentSrc)
            || currentSrc !== stableSrc) {
            iframe.setAttribute('src', stableSrc);
          }
        }
      }
    }

    this.blueprintOverlayVisible = shouldOpen;
    this.gameplayPausedByBlueprint = shouldOpen;
    this.syncGameplayPauseState();
    this.updateBlueprintChevronState();

    if (!shouldOpen && this.blueprintReturnToSettingsOnClose && !this.gameState?.gameOver) {
      this.blueprintReturnToSettingsOnClose = false;
      const reopenSettings = () => {
        if (!this.scene?.isDestroyed) {
          this.toggleAudioSettingsPanel(true);
        }
      };
      if (this.time?.delayedCall) {
        this.time.delayedCall(60, reopenSettings);
      } else {
        reopenSettings();
      }
    }
  },

  getBlueprintWeaponRuntimeStateSnapshot: function () {
    const snapshot = {};
    if (!(this.blueprintWeaponRuntimeStateByName instanceof Map)) {
      return snapshot;
    }
    this.blueprintWeaponRuntimeStateByName.forEach((state, name) => {
      snapshot[name] = JSON.parse(JSON.stringify(state));
    });
    return snapshot;
  },

  persistBlueprintRuntimeState: function () {
    try {
      const snapshot = this.getBlueprintWeaponRuntimeStateSnapshot();
      const names = Object.keys(snapshot || {});
      if (!names.length) {
        window?.localStorage?.removeItem(BLUEPRINT_RUNTIME_STATE_STORAGE_KEY);
        sessionStorage.removeItem(BLUEPRINT_RUNTIME_STATE_SESSION_FALLBACK_KEY);
        return;
      }
      window?.localStorage?.setItem(BLUEPRINT_RUNTIME_STATE_STORAGE_KEY, JSON.stringify(snapshot));
    } catch (_) {
      // Ignore storage write failures in private/incognito browser contexts.
    }
  },

  clearBlueprintRuntimeStateStorage: function () {
    try {
      window?.localStorage?.removeItem(BLUEPRINT_RUNTIME_STATE_STORAGE_KEY);
    } catch (_) {
      // Ignore storage failures.
    }
    try {
      sessionStorage.removeItem(BLUEPRINT_RUNTIME_STATE_SESSION_FALLBACK_KEY);
    } catch (_) {
      // Ignore storage failures.
    }
  },

  resetArmoryProgress: function (restartScene = true) {
    this.clearBlueprintRuntimeStateStorage();
    this.blueprintWeaponRuntimeStateByName = new Map();

    if (!restartScene) {
      this.setStatus('Armory progress reset.', '#ffd38f');
      return true;
    }

    if (this.audioSettingsPanel?.visible) {
      this.toggleAudioSettingsPanel(false);
    }
    this.toggleBlueprintOverlay(false);
    this.teardownBlueprintOverlay();
    this.stopThemeMusic();
    this.gameplayPausedByPlayer = false;
    this.gameplayPausedBySettings = false;
    this.gameplayPausedByBlueprint = false;
    this.gameplayPauseActive = false;
    this.physics?.world?.resume();
    this.scene.restart();
    return true;
  },

  restoreBlueprintRuntimeState: function () {
    return restoreBlueprintRuntimeStateSystem.call(this);
  },

  applyBlueprintWeaponRuntimeState: function (payload) {
    return applyBlueprintWeaponRuntimeStateSystem.call(this, payload);
  },

  setPhaserTopHudVisible: function (visible) {
    (this.phaserTopHudElements || []).forEach((obj) => {
      if (!obj || !obj.active) {
        return;
      }
      obj.setVisible(visible);
      if (!visible && typeof obj.disableInteractive === 'function') {
        obj.disableInteractive();
      }
    });
  },

  setupNativeLifecycleHandlers: function () {
    if (this.visibilityChangeHandler || typeof document === 'undefined') {
      return;
    }

    this.visibilityChangeHandler = () => {
      if (this.gameState?.gameOver) {
        return;
      }

      if (document.hidden) {
        if (!this.gameplayPauseActive) {
          this.gameplayPausedByPlayer = true;
          this.visibilityAutoPaused = true;
          this.syncGameplayPauseState();
        } else {
          this.visibilityAutoPaused = false;
        }
        this.stopThemeMusic();
        return;
      }

      if (this.visibilityAutoPaused) {
        this.visibilityAutoPaused = false;
        this.gameplayPausedByPlayer = false;
        this.syncGameplayPauseState();
      }

      if (!this.gameState?.prepPhase && !this.gameplayPauseActive && !this.gameState?.gameOver) {
        this.playBattleThemeMusic();
      } else if (this.gameplayPausedBySettings) {
        this.playSettingsThemeMusic();
      }
    };

    document.addEventListener('visibilitychange', this.visibilityChangeHandler);
  },

  teardownNativeLifecycleHandlers: function () {
    if (!this.visibilityChangeHandler || typeof document === 'undefined') {
      return;
    }
    document.removeEventListener('visibilitychange', this.visibilityChangeHandler);
    this.visibilityChangeHandler = null;
  },

  updateHtmlHudValues: function (force = false) {
    if (!this.useHtmlHudOverlay || !this.htmlHudValues) {
      return;
    }

    const now = this.time?.now || performance.now();
    if (!force && now < (this.nextHtmlHudUpdateAt || 0)) {
      return;
    }
    this.nextHtmlHudUpdateAt = now + this.htmlHudUpdateIntervalMs;

    const isAttackRole = this.gameState?.selectedMode === 'multiplayer'
      && this.gameState?.multiplayerRole === 'enemyCommander';
    const commanderData = this.loadCommanderData ? this.loadCommanderData() : { name: 'Player' };
    const commanderName = this.getCommanderDisplayName ? this.getCommanderDisplayName() : String(commanderData?.name || 'Player');
    const displayCurrency = isAttackRole
      ? Math.round(Math.max(0, Number(this.multiplayerRuntime?.threat || 0)))
      : (isFinite(this.gameState?.gold) ? this.gameState.gold : 0);
    const techParts = Math.max(0, Number(this.gameState?.techParts || 0));
    if (this.htmlHudValues.commanderName) this.htmlHudValues.commanderName.textContent = commanderName;
    if (this.htmlHudValues.gold) this.htmlHudValues.gold.textContent = String(displayCurrency);
    if (this.htmlHudValues.goldKey) this.htmlHudValues.goldKey.textContent = isAttackRole ? 'Bounty' : 'Gold';
    if (this.htmlHudValues.tech) this.htmlHudValues.tech.textContent = String(techParts);
    if (this.htmlHudValues.lives) this.htmlHudValues.lives.textContent = String(this.gameState?.lives ?? 0);
    if (this.htmlHudValues.wave) this.htmlHudValues.wave.textContent = String(this.gameState?.wave ?? 0);
    if (this.htmlHudValues.world) this.htmlHudValues.world.textContent = String((this.gameState?.selectedWorldIndex ?? 0) + 1);
    if (this.htmlHudValues.level) this.htmlHudValues.level.textContent = String(this.getEffectivePlayerLevel?.() || 1);
    if (this.htmlHudValues.score) this.htmlHudValues.score.textContent = 'SCORE ' + (this.gameState?.score ?? 0);

    if (this.htmlHudValues.status) {
      const fallback = 'Armory open. Spend gold or tech parts to prep for next wave.';
      const statusFromPhaser = this.statusText?.text || '';
      this.htmlHudValues.status.textContent = (statusFromPhaser && statusFromPhaser.trim().length > 0) ? statusFromPhaser : fallback;
    }

    if (this.htmlHudValues.protocolTitle || this.htmlHudValues.protocolCopy || this.htmlHudValues.protocolMeta) {
      if (isAttackRole) {
        if (this.htmlHudValues.protocolTitle) this.htmlHudValues.protocolTitle.textContent = 'ATTACK PROTOCOL';
        if (this.htmlHudValues.protocolCopy) this.htmlHudValues.protocolCopy.textContent = 'Deploy enemy squads from the tray and drop them on highlighted path lanes. Drain defender lives to 0 to win.';
        if (this.htmlHudValues.protocolMeta) this.htmlHudValues.protocolMeta.textContent = 'Spend bounty • Manage cooldowns • Pressure all routes';
      } else {
        if (this.htmlHudValues.protocolTitle) this.htmlHudValues.protocolTitle.textContent = 'DEFENSE PROTOCOL';
        if (this.htmlHudValues.protocolCopy) this.htmlHudValues.protocolCopy.textContent = 'Select a weapon to arm it, move your mouse/finger to aim, then tap the map to place. Drag still works too.';
        if (this.htmlHudValues.protocolMeta) this.htmlHudValues.protocolMeta.textContent = 'Costs vary • Auto-target • Defend the core';
      }
    }

    this.refreshLightningBlobControl();
  },

  setupLightningBlobControl: function () {
    return setupLightningBlobControlSystem.call(this);
  },

  getPlayerLightningCooldownRemainingMs: function () {
    return getPlayerLightningCooldownRemainingMsSystem.call(this);
  },

  shouldBypassLightningWindowRequirement: function (options = {}) {
    return shouldBypassLightningWindowRequirementSystem.call(this, options);
  },

  canTriggerPlayerLightning: function (options = {}) {
    return canTriggerPlayerLightningSystem.call(this, options);
  },

  refreshLightningBlobControl: function () {
    return refreshLightningBlobControlSystem.call(this);
  },

  triggerPlayerLightningFromControl: function (options = {}) {
    return triggerPlayerLightningFromControlSystem.call(this, options);
  },

  returnToWorldSelectFromHud: function () {
    return returnToWorldSelectFromHudSystem.call(this);
  },

  isMultiplayerModeEnabled: function () {
    return isMultiplayerModeEnabledSystem.call(this);
  },

  isMultiplayerEnemyCommanderRole: function () {
    return isMultiplayerEnemyCommanderRoleSystem.call(this);
  },

  canLocalPlayerBuildTowers: function () {
    return canLocalPlayerBuildTowersSystem.call(this);
  },

  initializeMultiplayerMode: function () {
    return initializeMultiplayerModeSystem.call(this);
  },

  setupMultiplayerCommanderOverlay: function () {
    return setupMultiplayerCommanderOverlaySystem.call(this);
  },

  teardownMultiplayerCommanderOverlay: function () {
    return teardownMultiplayerCommanderOverlaySystem.call(this);
  },

  syncMultiplayerCommanderVisibility: function () {
    return syncMultiplayerCommanderVisibilitySystem.call(this);
  },

  updateMultiplayerCommanderHud: function (force = false) {
    return updateMultiplayerCommanderHudSystem.call(this, force);
  },

  startMultiplayerWave: function () {
    return startMultiplayerWaveSystem.call(this);
  },

  updateMultiplayerWaveRuntime: function (activeWaveEnemies = [], laneCleared = false) {
    return updateMultiplayerWaveRuntimeSystem.call(this, activeWaveEnemies, laneCleared);
  },

  runEnemyCommanderBot: function () {
    return runEnemyCommanderBotSystem.call(this);
  },

  runDefenderTowerBot: function (activeWaveEnemies = []) {
    return runDefenderTowerBotSystem.call(this, activeWaveEnemies);
  },

  getCommanderRouteOptions: function () {
    return getCommanderRouteOptionsSystem.call(this);
  },

  setCommanderRouteKey: function (routeKey) {
    return setCommanderRouteKeySystem.call(this, routeKey);
  },

  setCommanderPlaneLane: function (laneKey) {
    return setCommanderPlaneLaneSystem.call(this, laneKey);
  },

  tryCommanderSpawn: function (enemyType, options = {}) {
    return tryCommanderSpawnSystem.call(this, enemyType, options);
  },

  shiftEnemyTrayCarousel: function (direction = 1) {
    return shiftEnemyTrayCarouselSystem.call(this, direction);
  },

  getEnemyTrayCards: function () {
    return getEnemyTrayCardsSystem.call(this);
  },

  pushEnemyTrayCardsToHtml: function (force = false) {
    return pushEnemyTrayCardsToHtmlSystem.call(this, force);
  },

  setupEnemySpawnEntrances: function () {
    return setupEnemySpawnEntrancesSystem.call(this);
  },

  clearEnemySpawnEntrances: function () {
    return clearEnemySpawnEntrancesSystem.call(this);
  },

  updateEnemyDragDropHover: function (worldX, worldY, enemyDefRef = null) {
    return updateEnemyDragDropHoverSystem.call(this, worldX, worldY, enemyDefRef);
  },

  highlightEnemySpawnDropTarget: function (routeKey = null, showGuide = false, options = null) {
    return highlightEnemySpawnDropTargetSystem.call(this, routeKey, showGuide, options);
  },

  handleEnemyTrayDrop: function (enemyDefRef, worldX, worldY) {
    return handleEnemyTrayDropSystem.call(this, enemyDefRef, worldX, worldY);
  },

  seedDefenderBotLoadout: function () {
    return seedDefenderBotLoadoutSystem.call(this);
  },

  // ── Commander Level (persistent, localStorage) ──────────────────
  loadCommanderData: function () {
    return loadCommanderDataSystem.call(this);
  },

  getCommanderDisplayName: function () {
    return getCommanderDisplayNameFromStorage(this.loadCommanderData());
  },

  loadCommanderLeaderboard: function () {
    return loadCommanderLeaderboardFromStorage(window?.localStorage);
  },

  recordCommanderLeaderboardEntry: function (score) {
    return recordCommanderLeaderboardEntryFromStorage(this.loadCommanderData(), score, window?.localStorage);
  },

  saveCommanderData: function (data) {
    return saveCommanderDataSystem.call(this, data);
  },

  earnCommanderXP: function (amount) {
    return earnCommanderXPSystem.call(this, amount);
  },

  recordWorldCleared: function (worldId) {
    return recordWorldClearedSystem.call(this, worldId);
  },

  countClearedByTier: function (tier) {
    return countClearedByTierSystem.call(this, tier);
  },

  isWorldUnlocked: function (world) {
    return isWorldUnlockedSystem.call(this, world);
  },

  // ── Difficulty helpers ───────────────────────────────────────────
  getDifficultyConfig: function () {
    return getDifficultyConfigSystem.call(this);
  },

  initShotSoundPools: function () {
    return initShotSoundPoolsSystem.call(this);
  },

  getPooledShot: function (key) {
    return getPooledShotSystem.call(this, key);
  },

  initAudioSettings: function () {
    return initAudioSettingsSystem.call(this);
  },

  persistAudioSettings: function () {
    return persistAudioSettingsSystem.call(this);
  },

  loadGameplaySettings: function () {
    return loadGameplaySettingsSystem.call(this);
  },

  isPathGuideFeatureAvailable: function () {
    return isPathGuideFeatureAvailableSystem.call(this);
  },

  persistGameplaySettings: function () {
    return persistGameplaySettingsSystem.call(this);
  },

  getAudioBusLevel: function (bus) {
    return getAudioBusLevelSystem.call(this, bus);
  },

  getConfiguredAudioVolume: function (bus, baseVolume = 1) {
    return getConfiguredAudioVolumeSystem.call(this, bus, baseVolume);
  },

  setAudioBusLevel: function (bus, level, announce = false) {
    return setAudioBusLevelSystem.call(this, bus, level, announce);
  },

  syncGameplayPauseState: function () {
    return syncGameplayPauseStateSystem.call(this);
  },

  updatePauseHudButton: function () {
    return updatePauseHudButtonSystem.call(this);
  },

  togglePlayerPause: function () {
    return togglePlayerPauseSystem.call(this);
  },

  restartFromHud: function () {
    return restartFromHudSystem.call(this);
  },

  setPathGuideVisible: function (visible) {
    return setPathGuideVisibleSystem.call(this, visible);
  },

  togglePathGuide: function () {
    return togglePathGuideSystem.call(this);
  },

  toggleAudioSettingsPanel: function (forceOpen = null) {
    return toggleAudioSettingsPanelSystem.call(this, forceOpen);
  },

  openWeaponUpgradesFromSettings: function () {
    const worldSelectVisible = (() => {
      const ov = typeof document !== 'undefined' ? document.getElementById('world-select-overlay') : null;
      if (!ov) return false;
      if (ov.style.display && ov.style.display !== 'none') return true;
      try {
        return window.getComputedStyle(ov).display !== 'none';
      } catch (_) {
        return false;
      }
    })();

    if (!this.useBlueprintOverlay || (this.gameState?.gameOver && !worldSelectVisible)) {
      return;
    }

    this.blueprintReturnToSettingsOnClose = true;
    this.toggleAudioSettingsPanel(false);

    const openOverlay = () => {
      if (!this.scene?.isDestroyed) {
        this.toggleBlueprintOverlay(true);
      }
    };

    if (this.time?.delayedCall) {
      this.time.delayedCall(80, openOverlay);
    } else {
      openOverlay();
    }
  },

  setupAudioSettingsPanel: function () {
    return setupGameAudioSettingsPanel.call(this);
  },

  refreshAudioSettingsPanel: function () {
    return refreshAudioSettingsPanelSystem.call(this);
  },

  setupFireDebugOverlay: function () {
    return setupFireDebugOverlaySystem.call(this);
  },

  setupDebugHotkeys: function () {
    return setupDebugHotkeysSystem.call(this);
  },

  startDeterministicWeaponLoop: function () {
    return startDeterministicWeaponLoopSystem.call(this);
  },

  stopDeterministicWeaponLoop: function () {
    return stopDeterministicWeaponLoopSystem.call(this);
  },

  runDeterministicWeaponStep: function () {
    return runDeterministicWeaponStepSystem.call(this);
  },

  populateTestTowerLoadout: function () {
    return populateTestTowerLoadoutSystem.call(this);
  },

  recordFireDebugShot: function (tower, enemy, damageEstimate = 0) {
    return recordFireDebugShotSystem.call(this, tower, enemy, damageEstimate);
  },

  updateFireDebugOverlay: function () {
    return updateFireDebugOverlaySystem.call(this);
  },

  setupPlacementPreview: function () {
    return setupPlacementPreviewSystem.call(this);
  },

  setupBuildPhaseControls: function () {
    return setupBuildPhaseControlsSystem.call(this, {
      getWeaponTrayLabel,
      vibrateImpact,
      vibrateSelectionChanged,
    });
  },

  getUnlockedWeaponCatalog: function () {
    const unlocked = (this.towerCatalog || []).filter((towerDef) => this.isWeaponUnlockedForPlayer(towerDef));
    if (unlocked.length > 0) {
      return unlocked;
    }
    return this.towerCatalog && this.towerCatalog.length > 0 ? [this.towerCatalog[0]] : [];
  },

  shiftWeaponCarousel: function (direction) {
    const visibleCatalog = this.getUnlockedWeaponCatalog();
    const total = visibleCatalog.length;
    if (total <= 0) {
      return;
    }
    this.weaponCarouselIndex = (this.weaponCarouselIndex + direction + total) % total;
    this.renderWeaponCarousel();

    const centerEntry = this.weaponHudCards[1];
    if (centerEntry?.towerDef) {
      this.selectTowerDef(centerEntry.towerDef);
    }
  },

  renderWeaponCarousel: function () {
    const visibleCatalog = this.getUnlockedWeaponCatalog();
    const total = visibleCatalog.length;
    if (total <= 0) {
      this.weaponHudCards.forEach((entry) => {
        entry.towerDef = null;
      });
      if (typeof window.__updateHtmlTray === 'function') {
        window.__updateHtmlTray([]);
      }
      return;
    }

    this.weaponCarouselIndex = ((this.weaponCarouselIndex % total) + total) % total;
    this.weaponHudCards.forEach((entry, index) => {
      const towerDef = visibleCatalog[(this.weaponCarouselIndex + index) % total];
      entry.towerDef = towerDef;
      if (entry.image?.active) {
        entry.image.setTexture(towerDef.key);
        entry.image.setTint(0xffffff);
        entry.image.setAlpha(1);
      }
      if (entry.numberLabel?.active) {
        entry.numberLabel.setText(getWeaponTrayCardLabel(towerDef));
        entry.numberLabel.setColor('#effbff');
      }
    });

    if (this.weaponCarouselPrev) {
      this.weaponCarouselPrev.setAlpha(total > 3 ? 1 : 0.35);
    }
    if (this.weaponCarouselNext) {
      this.weaponCarouselNext.setAlpha(total > 3 ? 1 : 0.35);
    }

    // Update HTML tray with crisp CSS rendering
    if (typeof window.__updateHtmlTray === 'function') {
      if (this.isMultiplayerEnemyCommanderRole?.()) {
        if (typeof window.__setHtmlTrayMode === 'function') {
          window.__setHtmlTrayMode('enemy');
        }
        return;
      }

      const cards = this.weaponHudCards.map((entry, index) => {
        const towerDef = entry.towerDef;
        if (!towerDef) return { src: '', name: '', label: '', locked: true, isCenter: index === 1, towerDefRef: null };
        const weaponLib = WEAPON_LIBRARY.find((w) => w.id === towerDef.id);
        return {
          weaponId: towerDef.id,
          assetPath: weaponLib?.assetPath || '',
          label: getWeaponTrayCardLabel(towerDef),
          locked: false,
          isCenter: index === 1,
          towerDefRef: towerDef,
        };
      });
      window.__updateHtmlTray(cards);
    }
  },

  animateLoadoutHud: function () {
    const animatedObjects = [
      this.weaponPreviewHalo,
      this.weaponPreviewRing,
      this.weaponDetailPanel,
      this.weaponDetailBadge,
      this.weaponCarouselPrev,
      this.weaponCarouselNext,
      this.weaponDetailImage,
      this.weaponDetailTitle,
      this.weaponDetailRole,
      this.weaponDetailStats,
      this.weaponDetailFlavor,
      this.weaponInfoText,
      this.startWaveButton,
      this.startWaveButtonLabel,
      ...this.weaponHudCards.flatMap((entry) => [entry.card, entry.image, entry.numberLabel]),
    ].filter(Boolean);

    animatedObjects.forEach((item) => {
      item.setAlpha(0);
      item.y += sy(8);
    });

    animatedObjects.forEach((item, index) => {
      this.tweens.add({
        targets: item,
        alpha: 1,
        y: item.y - sy(8),
        duration: 320,
        delay: 40 + (index * 18),
        ease: 'Cubic.Out',
      });
    });
  },

  selectTowerDef: function (towerDef, preservePlacedSelection = false) {
    if (towerDef && !this.isWeaponUnlockedForPlayer(towerDef)) {
      this.setStatus(
        towerDef.name + ' unlocks at player level ' + towerDef.unlockLevel + '.',
        '#ffcf8a'
      );
      return;
    }

    if (!preservePlacedSelection) {
      this.selectedPlacedTower = null;
    }

    this.selectedTowerDef = towerDef || null;

    if (this.selectedTowerDef) {
      const visibleCatalog = this.getUnlockedWeaponCatalog();
      const selectedIndex = visibleCatalog.findIndex((item) => item.id === this.selectedTowerDef.id);
      if (selectedIndex >= 0) {
        const total = visibleCatalog.length;
        this.weaponCarouselIndex = (selectedIndex - 1 + total) % total;
        this.renderWeaponCarousel();
      }
    }

    this.weaponHudCards.forEach((entry) => {
      if (!entry?.card || !entry?.image) {
        return;
      }
      const isSelected = this.selectedTowerDef && entry.towerDef && entry.towerDef.id === this.selectedTowerDef.id;
      entry.card.setFillStyle(isSelected ? 0x1f5d87 : 0x15345a, 0.98);
      entry.card.setStrokeStyle(2, isSelected ? 0xa6efff : 0x4d88bd, isSelected ? 1 : 0.55);
      entry.image.setScale(isSelected ? 0.58 : 0.5);
    });

    if (this.selectedTowerDef) {
      this.previewTower.setTexture(this.selectedTowerDef.key);
      this.previewTowerLabel.setText(getWeaponTrayLabel(this.selectedTowerDef));
      if (this.weaponPreviewHalo) {
        this.tweens.killTweensOf(this.weaponPreviewHalo);
        this.weaponPreviewHalo.setScale(1);
        this.tweens.add({
          targets: this.weaponPreviewHalo,
          scale: 1.06,
          duration: 240,
          yoyo: true,
          ease: 'Sine.Out',
        });
      }
      if (this.weaponDetailImage) {
        this.weaponDetailImage.setTexture(this.selectedTowerDef.key);
        this.weaponDetailImage.setScale(1.08);
        this.weaponDetailImage.setY(this.weaponPreviewCenterY - sy(8));
        this.weaponDetailImage.setX(this.weaponDetailImage.getData('homeX') || sx(96));
        this.weaponDetailImage.setAlpha(1);
        this.tweens.killTweensOf(this.weaponDetailImage);
        this.tweens.add({
          targets: this.weaponDetailImage,
          scale: 1.16,
          duration: 180,
          yoyo: true,
          ease: 'Back.Out',
        });
      }
      if (this.weaponPreviewLabel) {
        this.weaponPreviewLabel.setText('');
        this.weaponPreviewLabel.setVisible(false);
      }
      if (this.weaponDetailTitle) {
        this.weaponDetailTitle.setText(this.selectedTowerDef.name);
      }
      if (this.weaponDetailRole) {
        const pattern = this.selectedTowerDef.firePattern || 'single';
        const fireClass = (pattern === 'laser' || pattern === 'lance')
          ? 'Laser'
          : pattern === 'pulsar'
            ? 'Pulsar'
            : 'Ballistic';
        const rangeLabel = this.selectedTowerDef.range < TOWER_RANGE * 0.9
          ? 'Short range'
          : this.selectedTowerDef.range > TOWER_RANGE * 1.28
            ? 'Long range'
            : 'Medium range';
        const fireLabel = this.selectedTowerDef.fireRate <= 380
          ? 'Rapid fire'
          : this.selectedTowerDef.fireRate <= 650
            ? 'Steady fire'
            : 'Heavy shots';
        const powerTierLabel = this.selectedTowerDef.powerTierLabel || this.getWeaponPowerTierInfo(this.selectedTowerDef.baseDamage || this.selectedTowerDef.damage || 0).label;
        this.weaponDetailRole.setText('Class: ' + fireClass + '  |  ' + powerTierLabel + '  |  Profile: ' + rangeLabel + ' • ' + fireLabel);
      }
      if (this.weaponDetailStats) {
        const hitPowerValue = this.selectedTowerDef.baseDamage || this.selectedTowerDef.damage || 0;
        const powerTierLabel = this.selectedTowerDef.powerTierLabel || this.getWeaponPowerTierInfo(hitPowerValue).label;
        this.weaponDetailStats.setText(
          'Best use: ' + (this.selectedTowerDef.role || 'General-purpose defense') + '\n' +
          'Hit power: ' + hitPowerValue.toFixed(2) + '  |  Tier: ' + powerTierLabel + '\n' +
          'Cost ' + this.selectedTowerDef.cost + '  |  Magazine ' + this.selectedTowerDef.magSize + '\n' +
          'Unlock level: ' + (this.selectedTowerDef.unlockLevel || 1)
        );
      }
    }

    this.refreshSelectedPlacedTowerDetails();
    this.updateTowerBaseIndicators();
    if (this.useHtmlWeaponTray && this.selectedTowerDef) this._notifyHtmlTrayDetail(this.selectedTowerDef);
  },

  getTowerUpgradeCapForPlayerLevel: function () {
    return Math.max(2, Math.min(8, this.getEffectivePlayerLevel()));
  },

  getTowerUpgradeCost: function (tower) {
    if (!tower?.active) {
      return Number.POSITIVE_INFINITY;
    }
    const sourceDef = tower.getData('sourceTowerDef');
    const baseCost = Math.max(20, sourceDef?.cost || 30);
    const currentLevel = Math.max(1, tower.getData('upgradeLevel') || 1);
    return Math.round(baseCost * (1.1 + (currentLevel * 0.85)));
  },

  refreshSelectedPlacedTowerDetails: function () {
    const selectedTower = this.selectedPlacedTower;
    const hasActiveSelection = !!(selectedTower && selectedTower.active);
    const htmlTrayActive = !!this.useHtmlWeaponTray;
    const waveOverlayVisible = !!(
      this.htmlWaveClearOverlayNode
      && this.htmlWaveClearOverlayNode.style.display !== 'none'
    );

    if (waveOverlayVisible) {
      if (this.removeTowerButton?.active) {
        this.removeTowerButton.setVisible(false).disableInteractive();
      }
      if (this.removeTowerButtonLabel?.active) {
        this.removeTowerButtonLabel.setVisible(false);
      }
      if (typeof window.__showTowerRemoveBtn === 'function') window.__showTowerRemoveBtn(false);
      return;
    }

    if (!hasActiveSelection) {
      this.selectedPlacedTower = null;
    if (this.removeTowerButton?.active) {
      this.removeTowerButton.setVisible(false).disableInteractive();
    }
    if (this.removeTowerButtonLabel?.active) {
      this.removeTowerButtonLabel.setVisible(false);
    }
    if (typeof window.__showTowerRemoveBtn === 'function') window.__showTowerRemoveBtn(false);
    return;
    }

    const sourceDef = selectedTower.getData('sourceTowerDef')
      || this.towerCatalog.find((item) => item.id === selectedTower.getData('towerId'))
      || this.selectedTowerDef;
    const towerLevel = Math.max(1, selectedTower.getData('upgradeLevel') || 1);
    const maxLevelByPlayer = this.getTowerUpgradeCapForPlayerLevel();
    const hp = Math.max(0, selectedTower.getData('health') || 0);
    const maxHp = Math.max(1, selectedTower.getData('maxHealth') || TOWER_MAX_HEALTH);
    const upgradeCost = this.getTowerUpgradeCost(selectedTower);
    if (this.weaponDetailTitle?.active) {
      this.weaponDetailTitle.setText((sourceDef?.name || 'Turret') + '  [DEPLOYED]');
    }
    if (this.weaponDetailRole?.active) {
      this.weaponDetailRole.setText(
        'Tower tier L' + towerLevel +
        '  |  Player unlock cap L' + maxLevelByPlayer +
        '  |  Weapon unlock L' + (sourceDef?.unlockLevel || 1)
      );
    }
    if (this.weaponDetailStats?.active) {
      this.weaponDetailStats.setText(
        'Damage: ' + (selectedTower.getData('damage') || 0).toFixed(2) +
        '  |  Range: ' + Math.round(selectedTower.getData('range') || 0) + '\n' +
        'Fire rate: ' + Math.round(selectedTower.getData('fireRate') || 0) + ' ms  |  Armor pen: ' + (selectedTower.getData('armorPen') || 0).toFixed(2) + '\n' +
        'HP: ' + hp.toFixed(1) + ' / ' + maxHp.toFixed(1)
      );
    }

    if (this.removeTowerButton?.active) {
      if (htmlTrayActive) {
        this.removeTowerButton.setVisible(false).disableInteractive();
        this.removeTowerButtonLabel?.setVisible(false);
      } else {
        this.removeTowerButton.setVisible(true);
        this.removeTowerButtonLabel.setVisible(true);
        this.removeTowerButton.setInteractive({ useHandCursor: true });
        this.removeTowerButton.setFillStyle(0x6b3f3f, 0.9);
        this.removeTowerButton.setStrokeStyle(2, 0xff9999, 0.68);
        this.removeTowerButtonLabel.setText('REMOVE');
        this.removeTowerButtonLabel.setColor('#ffe6e6');
      }
    }
    // Show floating HTML remove button near the tower on the map
    if (typeof window.__showTowerRemoveBtn === 'function') {
      window.__showTowerRemoveBtn(true, selectedTower.x, selectedTower.y);
    }
  },

  focusPlacedTower: function (tower) {
    if (!tower?.active) {
      return;
    }

    if (this.htmlWaveClearOverlayNode && this.htmlWaveClearOverlayNode.style.display !== 'none') {
      return;
    }

    const now = this.time?.now || 0;
    if (now < Number(this.suppressPlacedTowerFocusUntil || 0)) {
      return;
    }

    if (this.isMultiplayerEnemyCommanderRole?.()) {
      this.selectedPlacedTower = null;
      if (typeof window.__showTowerRemoveBtn === 'function') window.__showTowerRemoveBtn(false);
      this.refreshSelectedPlacedTowerDetails();
      return;
    }

    this.selectedPlacedTower = tower;
    const sourceDef = tower.getData('sourceTowerDef')
      || this.towerCatalog.find((item) => item.id === tower.getData('towerId'))
      || this.selectedTowerDef
      || this.towerCatalog[0];
    this.selectTowerDef(sourceDef, true);
    this.refreshSelectedPlacedTowerDetails();
    this.setStatus('Selected deployed turret. Review details or upgrade it.', '#9df8ff');
  },

  upgradeSelectedPlacedTower: function () {
    if (this.isMultiplayerEnemyCommanderRole?.()) {
      this.setStatus('Enemy Commander cannot upgrade defender towers.', '#ffcf8a');
      return;
    }

    const tower = this.selectedPlacedTower;
    if (!tower?.active) {
      this.setStatus('Select a deployed turret first.', '#ffcf8a');
      return;
    }
    if (!this.gameState?.prepPhase) {
      this.setStatus('Upgrades are available during prep phase only.', '#ffcf8a');
      return;
    }

    const currentLevel = Math.max(1, tower.getData('upgradeLevel') || 1);
    const maxLevelByPlayer = this.getTowerUpgradeCapForPlayerLevel();
    if (currentLevel >= maxLevelByPlayer) {
      this.setStatus('Upgrade locked. Reach player level ' + (currentLevel + 1) + ' to unlock next tier.', '#ffcf8a');
      this.refreshSelectedPlacedTowerDetails();
      return;
    }

    const cost = this.getTowerUpgradeCost(tower);
    if (this.gameState.gold < cost) {
      this.setStatus('Not enough gold to upgrade this turret.', '#ff8fa7');
      this.refreshSelectedPlacedTowerDetails();
      return;
    }

    this.gameState.gold -= cost;
    const nextLevel = currentLevel + 1;
    tower.setData('upgradeLevel', nextLevel);
    tower.setData('damage', (tower.getData('damage') || 1) * 1.3);
    tower.setData('range', (tower.getData('range') || TOWER_RANGE) * 1.06);
    tower.setData('fireRate', Math.max(90, Math.round((tower.getData('fireRate') || TOWER_FIRE_RATE) * 0.88)));
    tower.setData('armorPen', (tower.getData('armorPen') || 0) + 0.25);
    tower.setData('towerArmor', (tower.getData('towerArmor') || 0) + 0.16);
    const nextMaxHealth = Math.max(1, (tower.getData('maxHealth') || TOWER_MAX_HEALTH) + 1);
    tower.setData('maxHealth', nextMaxHealth);
    tower.setData('health', Math.min(nextMaxHealth, (tower.getData('health') || nextMaxHealth) + 1));

    const boostedScale = Math.min(1.15, (tower.getData('baseScale') || tower.scaleX || 0.6) * 1.035);
    tower.setData('baseScale', boostedScale);
    tower.setScale(boostedScale);
    const fireAnimSprite = tower.getData('fireAnimSprite');
    if (fireAnimSprite?.active) {
      fireAnimSprite.setScale(boostedScale);
    }

    const towerIdLabel = tower.getData('idLabel');
    if (towerIdLabel?.active) {
      const towerId = tower.getData('towerId') || '?';
      towerIdLabel.setText(String(towerId) + ' L' + nextLevel);
    }

    this.syncTowerHealthVisual(tower);
    this.updateHud();
    this.refreshSelectedPlacedTowerDetails();
    this.setStatus('Turret upgraded to tier L' + nextLevel + '.', '#89ffd0');
  },

  removeSelectedPlacedTower: function () {
    if (this.isMultiplayerEnemyCommanderRole?.()) {
      this.setStatus('Enemy Commander cannot remove defender towers.', '#ffcf8a');
      return;
    }

    const tower = this.selectedPlacedTower;
    if (!tower?.active) {
      this.setStatus('Select a deployed turret first.', '#ffcf8a');
      return;
    }


    const sourceDef = tower.getData('sourceTowerDef')
      || this.towerCatalog.find((item) => item.id === tower.getData('towerId'));
    const refundAmount = sourceDef?.cost || BUILD_COST;
    
    this.gameState.gold += refundAmount;
    this.destroyTower(tower);
    this.selectedPlacedTower = null;
    if (typeof window.__showTowerRemoveBtn === 'function') window.__showTowerRemoveBtn(false);
    this.updateHud();
    this.refreshSelectedPlacedTowerDetails();
    this.setStatus('Turret removed. +' + refundAmount + ' gold refunded.', '#89ffd0');
  },

  getWeaponReachColor: function (towerDef) {
    if (!towerDef) {
      return {
        core: 0x7bdcff,
        ring: 0xc7f2ff,
      };
    }

    const pattern = towerDef.firePattern || 'single';
    if (pattern === 'laser' || pattern === 'lance') {
      return {
        core: 0x8ee1ff,
        ring: 0xd9f7ff,
      };
    }
    if (pattern === 'pulsar') {
      return {
        core: 0xb39dff,
        ring: 0xe9e2ff,
      };
    }

    return {
      core: 0x7ad8ff,
      ring: 0xc8efff,
    };
  },

  updateWeaponReachGlow: function (focusX = null, focusY = null) {
    if (!this.weaponReachGlowLayer) {
      return;
    }

    this.weaponReachGlowLayer.removeAll(true);

    const showGlow = !!this.selectedTowerDef
      && this.isWeaponUnlockedForPlayer(this.selectedTowerDef)
      && !!this.draggingFromTray;
    this.weaponReachGlowLayer.setVisible(showGlow);
    if (!showGlow) {
      return;
    }

    const activeTowerDef = this.activeTrayTowerDef || this.selectedTowerDef;
    const radius = activeTowerDef.range;
    const canAfford = (this.gameState?.gold ?? 0) >= (activeTowerDef.cost ?? 0);
    const colors = canAfford
      ? this.getWeaponReachColor(activeTowerDef)
      : { core: 0xff2222, ring: 0xff4444 };
    const fillAlpha  = canAfford ? { a: 0.035, b: 0.04,  c: 0.05  } : { a: 0.18, b: 0.22, c: 0.28 };
    const ringAlpha  = canAfford ? 0.17 : 0.85;
    const ringStroke = canAfford ? 2 : 3;

    if (this.isFreePlacementEnabled()) {
      const anchorX = typeof focusX === 'number' ? focusX : this.input?.activePointer?.worldX;
      const anchorY = typeof focusY === 'number' ? focusY : this.input?.activePointer?.worldY;
      if (typeof anchorX !== 'number' || typeof anchorY !== 'number') {
        return;
      }

      const canPlaceHere = this.canPlaceTowerAt(anchorX, anchorY);
      const placementColors = canPlaceHere ? colors : { core: 0xff2222, ring: 0xff4444 };
      const placementFillAlpha = canPlaceHere ? fillAlpha : { a: 0.18, b: 0.22, c: 0.28 };
      const placementRingAlpha = canPlaceHere ? ringAlpha : 0.85;
      const placementRingStroke = canPlaceHere ? ringStroke : 3;

      const outer = this.add.circle(anchorX, anchorY, radius, placementColors.core, placementFillAlpha.a).setDepth(1.33);
      const mid = this.add.circle(anchorX, anchorY, radius * 0.7, placementColors.core, placementFillAlpha.b).setDepth(1.331);
      const inner = this.add.circle(anchorX, anchorY, radius * 0.42, placementColors.core, placementFillAlpha.c).setDepth(1.332);
      const ring = this.buildTerrainRing(anchorX, anchorY, radius, placementColors.ring, placementRingAlpha, placementRingStroke);
      this.weaponReachGlowLayer.add([outer, mid, inner, ring]);
      return;
    }

    if (!this.towerBaseSlots) {
      return;
    }

    const availableSlots = this.towerBaseSlots.filter((slot) => !slot.occupied);
    if (availableSlots.length === 0) {
      return;
    }

    let anchorSlot = availableSlots[0];
    if (typeof focusX === 'number' && typeof focusY === 'number') {
      let bestDistance = Number.POSITIVE_INFINITY;
      availableSlots.forEach((slot) => {
        const distance = Phaser.Math.Distance.Between(focusX, focusY, slot.x, slot.y);
        if (distance < bestDistance) {
          bestDistance = distance;
          anchorSlot = slot;
        }
      });
    }

    const outer = this.add.circle(anchorSlot.x, anchorSlot.y, radius, colors.core, fillAlpha.a).setDepth(1.33);
    const mid = this.add.circle(anchorSlot.x, anchorSlot.y, radius * 0.7, colors.core, fillAlpha.b).setDepth(1.331);
    const inner = this.add.circle(anchorSlot.x, anchorSlot.y, radius * 0.42, colors.core, fillAlpha.c).setDepth(1.332);
    const ring = this.buildTerrainRing(anchorSlot.x, anchorSlot.y, radius, colors.ring, ringAlpha, ringStroke);

    this.weaponReachGlowLayer.add([outer, mid, inner, ring]);
  },

  // Returns a y-offset (pixels) simulating terrain elevation at world position (x, y).
  // Rocky/elevated areas push the ring up; flat grass areas leave it level.
  _getTerrainElevation: function (x, y) {
    const cache = this._getTerrainSampleCache();
    if (!cache) return 0;
    const nx = Phaser.Math.Clamp(x / BOARD_WIDTH,  0, 1);
    const ny = Phaser.Math.Clamp(y / BOARD_HEIGHT, 0, 1);
    const px = Math.floor(nx * (cache.w - 1));
    const py = Math.floor(ny * (cache.h - 1));
    const i  = (py * cache.w + px) * 4;
    const r = cache.data[i], g = cache.data[i + 1], b = cache.data[i + 2];
    // Grass (green dominant) = flat = 0. Rocky/brown = elevated = positive offset (raise up = -Y).
    const greenLead = g - Math.max(r, b);
    // greenLead > 0 → grass → flat. greenLead <= 0 → rocky → elevated.
    const rawElevation = Math.max(0, -greenLead);          // 0 on grass, >0 on rock
    return Phaser.Math.Clamp(rawElevation * 0.22, 0, sy(14)); // max ~14 logical units
  },

  // Draws the range ring as a terrain-following polygon instead of a flat circle.
  buildTerrainRing: function (ax, ay, radius, color, alpha, lineWidth) {
    const N = 72; // sample points around circumference
    const g = this.add.graphics().setDepth(1.334);
    g.lineStyle(lineWidth, color, alpha);
    g.beginPath();
    for (let i = 0; i <= N; i++) {
      const angle = (i / N) * Math.PI * 2;
      const px = ax + Math.cos(angle) * radius;
      const py = ay + Math.sin(angle) * radius;
      const elev = this._getTerrainElevation(px, py);
      // Elevation offsets Y upward (smaller Y = higher on screen).
      // Also scale X slightly inward on elevated sides for subtle perspective pinch.
      const perspX = ax + Math.cos(angle) * (radius - elev * 0.18);
      const perspY = (ay + Math.sin(angle) * radius) - elev;
      if (i === 0) g.moveTo(perspX, perspY);
      else         g.lineTo(perspX, perspY);
    }
    g.closePath();
    g.strokePath();
    return g;
  },

  updateTowerBaseIndicators: function () {
    if (this.isFreePlacementEnabled()) {
      if (this.draggingFromTray) {
        this.updateWeaponReachGlow();
      } else {
        this.clearWeaponReachGlow?.();
      }
      return;
    }

    if (!this.towerBaseSlots) {
      return;
    }

    this.towerBaseSlots.forEach((slot) => {
      if (!slot.selectionRing || !slot.clickTarget) {
        return;
      }

      const available = !slot.occupied;
      slot.clickTarget.disableInteractive();

      if (available && this.selectedTowerDef && this.draggingFromTray && this.isWeaponUnlockedForPlayer(this.selectedTowerDef)) {
        slot.selectionRing.setFillStyle(0x7bf7ff, 0.08);
        slot.selectionRing.setStrokeStyle(2, 0x89ffd0, 0.42);
        slot.clickTarget.setInteractive({ useHandCursor: true });
      } else if (available) {
        slot.selectionRing.setFillStyle(0x7bf7ff, 0.03);
        slot.selectionRing.setStrokeStyle(2, 0x7bf7ff, 0.16);
      } else {
        slot.selectionRing.setFillStyle(0xff8fa7, 0.05);
        slot.selectionRing.setStrokeStyle(2, 0xff8fa7, 0.12);
      }
    });

    this.updateWeaponReachGlow();
  },

  beginCombatPhase: function () {
    if (this.gameState.gameOver || !this.gameState.prepPhase) {
      return;
    }

    if (this.towers.children.size === 0 && !this.isMultiplayerEnemyCommanderRole?.()) {
      this.setStatus('Place at least one turret before starting the wave.', '#ffb18b');
      return;
    }

    this.cancelWaveCountdown();
    this.toggleBlueprintOverlay(false);
    this.gameState.prepPhase = false;
    if (this.startWaveButton) {
      this.startWaveButton.disableInteractive();
      this.startWaveButton.setFillStyle(0x3b4f5b, 0.75);
    }
    if (this.startWaveButtonLabel) {
      this.startWaveButtonLabel.setText('WAVE ACTIVE');
      this.startWaveButtonLabel.setColor('#c7d7e0');
    }
    if (typeof window.__setHtmlTrayWaveMode === 'function') window.__setHtmlTrayWaveMode(true);
    this.updatePauseHudButton();
    if (this.weaponReachGlowLayer) {
      this.weaponReachGlowLayer.setVisible(false);
    }
    if (DEBUG_FLAGS.fireTestMode) {
      this.clearWeaponFireTestRig();
    }
    this.playBattleThemeMusic();
    this.startWave();
  },

  startWaveCountdown: function (seconds) {
    if (DEBUG_FLAGS.fireTestMode) {
      this.cancelWaveCountdown();
      if (this.waveCountdownText?.active) {
        this.waveCountdownText.setVisible(false);
      }
      this.setStatus('Projectile test mode active. Auto-start disabled.', '#9df8ff');
      return;
    }

    this.cancelWaveCountdown();
    if (!this.waveCountdownText?.active) return;
    let remaining = seconds;
    this.waveCountdownText.setText('Auto-start in ' + remaining + 's').setVisible(true);
    this._waveCountdownInterval = this.time.addEvent({
      delay: 1000,
      repeat: seconds - 1,
      callback: () => {
        remaining -= 1;
        if (!this.waveCountdownText?.active) return;
        if (remaining <= 0) {
          this.waveCountdownText.setVisible(false);
          if (this.gameState?.prepPhase && !this.gameState?.gameOver) {
            this.beginCombatPhase();
          }
        } else {
          const urgentColor = remaining <= 10 ? '#ff7a7a' : '#ffcf7a';
          this.waveCountdownText.setText('Auto-start in ' + remaining + 's').setColor(urgentColor);
        }
      },
    });
  },

  cancelWaveCountdown: function () {
    if (this._waveCountdownInterval) {
      this._waveCountdownInterval.remove(false);
      this._waveCountdownInterval = null;
    }
    if (this.waveCountdownText?.active) {
      this.waveCountdownText.setVisible(false);
    }
  },

  forceBarrageForTesting: function () {
    if (this.gameState?.gameOver) {
      this.setStatus('Cannot force barrage after game over.', '#ffb18b');
      return false;
    }

    // Keep gameplay click targets usable during forced test runs.
    this.toggleBlueprintOverlay(false);
    this.gameplayPausedByBlueprint = false;
    this.updateGameplayPauseState?.();

    if (this.gameState?.prepPhase) {
      this.cancelWaveCountdown();
      this.gameState.prepPhase = false;
      this.playBattleThemeMusic();
      this.startWave();
    }

    if (!Array.isArray(this.spawnPlan) || !this.spawnPlan.length || (this.enemiesSpawned || 0) >= (this.enemyCount || 0)) {
      this.startWave();
    }

    const wavePlan = Array.isArray(this.spawnPlan) ? this.spawnPlan : [];
    let targetIndex = -1;
    const startIndex = Math.max(0, Number(this.spawnPlanIndex) || 0);
    for (let i = startIndex; i < wavePlan.length; i += 1) {
      if (wavePlan[i]?.isBarrage) {
        targetIndex = i;
        break;
      }
    }

    if (targetIndex < 0) {
      this.startWave();
      const resetPlan = Array.isArray(this.spawnPlan) ? this.spawnPlan : [];
      for (let i = 0; i < resetPlan.length; i += 1) {
        if (resetPlan[i]?.isBarrage) {
          targetIndex = i;
          break;
        }
      }
    }

    if (targetIndex < 0) {
      this.setStatus('No barrage steps available for this wave.', '#ffb18b');
      return false;
    }

    this.spawnPlanIndex = targetIndex;
    this.enemiesSpawned = Math.max(this.enemiesSpawned || 0, targetIndex);
    this.nextEnemyTime = (this.time?.now || 0) - 1;
    this.lightningTestingBypassWindow = true;
    this.setStatus('TEST: Barrage forced. Lightning window cap bypass enabled for cooldown testing.', '#9df8ff');
    return true;
  },

  setupWeaponFireTestRig: function () {
    if (!DEBUG_FLAGS.fireTestMode) {
      return;
    }

    this.clearWeaponFireTestRig();

    if (this.towers?.children?.entries?.length) {
      this.towers.children.entries.slice().forEach((tower) => {
        if (tower?.active) {
          this.destroyTower(tower);
        }
      });
    }

    const anchor = this.path?.[2] || this.path?.[0] || { x: BOARD_WIDTH * 0.4, y: BOARD_HEIGHT * 0.5 };
    if (!anchor) {
      return;
    }

    const pathAnchor = this.path?.[2];
    const offsets = [
      {
        x: pathAnchor ? pathAnchor.x + sx(124) : anchor.x + sx(106),
        y: pathAnchor ? pathAnchor.y : anchor.y + sy(24),
        armorClass: 'medium',
        tint: 0xd7f0ff,
        hp: 9999,
      },
    ];

    offsets.forEach((item) => {
      const activeTheme = this.activeVisualTheme || this.getThemeVariantForLevel(this.gameState?.level || 1);
      const halftrackKey = 'gsEnemyHalftrack_' + activeTheme;
      const halftrackAnimKey = 'enemyHalftrackDrive_' + activeTheme;

      const enemy = this.enemies.create(item.x, item.y, halftrackKey, 0);
      const dummyScale = 0.98 * GAMEPLAY_VISUAL_SCALE;
      enemy.setScale(dummyScale);
      enemy.setDepth(3);
      const previewSegment = this.pathSegments?.[2] || this.pathSegments?.[0];
      if (previewSegment) {
        enemy.setRotation(previewSegment.angle + (Math.PI / 2));
      }
      enemy.setData('isTestDummy', true);
      enemy.setData('health', item.hp);
      enemy.setData('maxHealth', item.hp);
      enemy.setData('armor', item.armorClass === 'heavy' ? 1.2 : item.armorClass === 'medium' ? 0.55 : 0.1);
      enemy.setData('armorClass', item.armorClass);
      enemy.setData('pathIndex', 0);
      enemy.setData('segmentDistance', 0);
      enemy.setData('baseScale', dummyScale);
      enemy.setData('speed', 0);
      enemy.setData('attackRange', 0);
      enemy.setData('fireRate', Number.MAX_SAFE_INTEGER);
      enemy.setData('attackDamage', 0);
      enemy.setData('lastFire', 0);
      enemy.setData('slowFactor', 1);
      enemy.setData('slowUntil', 0);
      enemy.setData('baseTintColor', item.tint);
      enemy.setTint(item.tint);
      if (this.anims.exists(halftrackAnimKey)) {
        enemy.play(halftrackAnimKey);
      }
      enemy.setData('shadow', this.add.image(enemy.x, enemy.y + sy(16), 'shadow').setAlpha(0.38).setScale(0.78 * GAMEPLAY_VISUAL_SCALE).setDepth(2));
      enemy.setData('barBg', this.add.rectangle(enemy.x, enemy.y - sy(26), sx(28), sy(5), 0x14070b, 0.9).setDepth(4));
      enemy.setData('barFill', this.add.rectangle(enemy.x - sx(14), enemy.y - sy(26), sx(28), sy(5), 0xff849b, 1).setOrigin(0, 0.5).setDepth(5));
      this.syncEnemyHealthVisual(enemy);
    });

    const mk2Weapon = (this.towerCatalog || []).find((weapon) => Number(weapon?.id) === 2) || this.towerCatalog?.[0] || null;
    if (mk2Weapon) {
      this.gameState.gold = Math.max(this.gameState.gold || 0, 9999);
      this.selectTowerDef?.(mk2Weapon);

      const placementAttempts = [];
      const pathAnchorX = pathAnchor ? pathAnchor.x : anchor.x;
      const pathAnchorY = pathAnchor ? pathAnchor.y : anchor.y;
      const testSlot = this.towerBaseSlots?.[0] || null;
      if (testSlot && !testSlot.occupied) {
        placementAttempts.push({ x: testSlot.x, y: testSlot.y });
      }
      placementAttempts.push(
        { x: pathAnchorX - sx(170), y: pathAnchorY + sy(120) },
        { x: pathAnchorX - sx(210), y: pathAnchorY + sy(82) },
        { x: pathAnchorX - sx(132), y: pathAnchorY + sy(154) },
        { x: pathAnchorX - sx(248), y: pathAnchorY + sy(34) },
        { x: sx(180), y: sy(700) },
        { x: sx(500), y: sy(700) },
        { x: sx(760), y: sy(700) },
        { x: sx(1040), y: sy(700) },
        { x: sx(250), y: sy(250) },
        { x: sx(600), y: sy(250) }
      );

      if (typeof this.canPlaceTowerAt === 'function' && this.isFreePlacementEnabled?.()) {
        for (let gridY = sy(220); gridY <= sy(760); gridY += sy(70)) {
          for (let gridX = sx(140); gridX <= sx(1220); gridX += sx(90)) {
            if (this.canPlaceTowerAt(gridX, gridY)) {
              placementAttempts.push({ x: gridX, y: gridY });
            }
          }
        }
      }

      let placedTower = null;
      for (let i = 0; i < placementAttempts.length; i += 1) {
        const attempt = placementAttempts[i];
        if (this.tryPlaceTower(attempt.x, attempt.y, mk2Weapon)) {
          placedTower = this.towers?.children?.entries?.find((tower) => tower?.active && tower.getData('towerId') === mk2Weapon.id) || null;
          if (placedTower) {
            break;
          }
        }
      }

      if (placedTower) {
        placedTower.setData('lastFire', 0);
        placedTower.setData('ammo', placedTower.getData('magSize') || 12);

        const testDummy = this.enemies?.children?.entries?.find((enemy) => enemy?.active && enemy.getData('isTestDummy'));
        if (testDummy) {
          const towerRange = Math.max(80, Number(placedTower.getData('range') || mk2Weapon.range || 170));
          const desiredDistance = Phaser.Math.Clamp(towerRange * 0.62, sx(82), sx(146));
          const targetX = Phaser.Math.Clamp(placedTower.x - (desiredDistance * 0.72), sx(120), BOARD_WIDTH - sx(120));
          const targetY = Phaser.Math.Clamp(placedTower.y - (desiredDistance * 0.46), sy(120), BOARD_HEIGHT - sy(120));
          testDummy.setPosition(targetX, targetY);

          const shadow = testDummy.getData('shadow');
          const barBg = testDummy.getData('barBg');
          const barFill = testDummy.getData('barFill');
          if (shadow) {
            shadow.setPosition(testDummy.x, testDummy.y + sy(16));
          }
          if (barBg) {
            barBg.setPosition(testDummy.x, testDummy.y - sy(26));
          }
          if (barFill) {
            barFill.setPosition(testDummy.x - sx(14), testDummy.y - sy(26));
          }
        }
      } else {
        this.setStatus('Projectile test mode: could not auto-place BURST MK2. Pick a build zone to place manually.', '#ffb18b');
      }
    }

    this.setStatus('Weapon fire test mode active. BURST MK2 auto-deployed and continuously firing at the dummy target.', '#9df8ff');
  },

  clearWeaponFireTestRig: function () {
    if (!this.enemies) {
      return;
    }

    const dummies = this.enemies.children.entries.filter((enemy) => enemy.getData('isTestDummy'));
    dummies.forEach((enemy) => {
      this.destroyEnemyVisuals(enemy);
      enemy.destroy();
    });
  },

  setupSoldierVisibilityTestRig: function () {
    this.clearSoldierVisibilityTestRig();

    if (!this.enemies) {
      return;
    }

    const anchor = { x: BOARD_WIDTH * 0.5, y: BOARD_HEIGHT * 0.5 };
    const previewDefs = [
      { number: 1, label: 'GRN CP1', anim: 'soldierGrenadeCp1', tint: 0xe1ffd8, scale: 2.24 },
    ];

    const startX = anchor.x;
    const startY = anchor.y;

    this.testPreviewSoldiers = [];
    previewDefs.forEach((def, idx) => {
      const x = startX;
      const y = startY;
      const sprite = this.enemies.create(x, y, 'soldierRunCp1Sheet', 0);
      sprite.setDepth(3.14);
      sprite.setScale(def.scale * GAMEPLAY_VISUAL_SCALE);
      sprite.setData('isTestDummy', true);
      sprite.setData('health', 9999);
      sprite.setData('maxHealth', 9999);
      sprite.setData('armor', 0.1);
      sprite.setData('armorClass', 'light');
      sprite.setData('pathIndex', 0);
      sprite.setData('segmentDistance', 0);
      sprite.setData('baseScale', def.scale * GAMEPLAY_VISUAL_SCALE);
      sprite.setData('speed', 0);
      sprite.setData('attackRange', 0);
      sprite.setData('fireRate', Number.MAX_SAFE_INTEGER);
      sprite.setData('attackDamage', 0);
      sprite.setData('lastFire', 0);
      sprite.setData('slowFactor', 1);
      sprite.setData('slowUntil', 0);
      sprite.setData('previewAnimKey', def.anim);
      sprite.setData('baseTintColor', def.tint);
      sprite.setTint(def.tint);
      sprite.setFlipX(idx % 2 === 1);

      if (this.anims.exists(def.anim)) {
        sprite.play(def.anim, true);
      }

      const label = this.add.text(
        x,
        y - sy(112),
        String(def.number) + '. ' + def.label,
        {
          fontFamily: 'Arial',
          fontSize: Math.max(10, Math.round(sx(11))) + 'px',
          color: '#ffffff',
          stroke: '#0c0f14',
          strokeThickness: 3,
          align: 'center',
        }
      )
        .setOrigin(0.5)
        .setDepth(6)
        .setAlpha(0.96);
      sprite.setData('previewLabel', label);

      sprite.setData('shadow', this.add.image(x, y + sy(34), 'shadow').setAlpha(0.38).setScale(0.84 * GAMEPLAY_VISUAL_SCALE).setDepth(2));
      sprite.setData('barBg', this.add.rectangle(x, y - sy(76), sx(28), sy(5), 0x14070b, 0.9).setDepth(4));
      sprite.setData('barFill', this.add.rectangle(x - sx(14), y - sy(76), sx(28), sy(5), 0x89ffd0, 1).setOrigin(0, 0.5).setDepth(5));
      this.syncEnemyHealthVisual(sprite);
      this.testPreviewSoldiers.push(sprite);
    });

    this.testPreviewAnimLoopEvent = this.time.addEvent({
      delay: 760,
      loop: true,
      callback: () => {
        const list = Array.isArray(this.testPreviewSoldiers) ? this.testPreviewSoldiers : [];
        list.forEach((sprite) => {
          if (!sprite?.active) {
            return;
          }
          const key = sprite.getData('previewAnimKey');
          if (key && this.anims.exists(key)) {
            sprite.play(key, false);
          }
        });
      },
    });

    this.setStatus('TEST: Soldier smoke grenade placed on map.', '#9df8ff');
  },

  clearSoldierVisibilityTestRig: function () {
    if (this.testPreviewAnimLoopEvent) {
      this.testPreviewAnimLoopEvent.remove(false);
      this.testPreviewAnimLoopEvent = null;
    }

    const previews = Array.isArray(this.testPreviewSoldiers) ? this.testPreviewSoldiers : [];
    previews.forEach((sprite) => {
      if (!sprite?.active) {
        return;
      }
      const label = sprite.getData('previewLabel');
      if (label?.active) {
        label.destroy();
      }
      this.destroyEnemyVisuals(sprite);
      sprite.destroy();
    });
    this.testPreviewSoldiers = [];
  },

  startSingleSoldierPathTest: function () {
    this.clearSoldierVisibilityTestRig?.();
    this.clearWeaponFireTestRig?.();

    if (!this.enemies) {
      return;
    }

    // Clean existing enemies so the scene only shows one path soldier.
    this.enemies.children.entries.slice().forEach((enemy) => {
      this.destroyEnemyVisuals(enemy);
      enemy.destroy();
    });
    this.towers.children.entries.slice().forEach((tower) => {
      this.destroyTower(tower);
    });

    this.spawnPlan = [];
    this.spawnPlanIndex = 0;
    this.enemyCount = 0;
    this.enemiesSpawned = 0;
    this.enemiesResolved = 0;
    this.enemiesDefeated = 0;
    this.nextEnemyTime = Number.POSITIVE_INFINITY;
    this.surgeActive = false;

    this.cancelWaveCountdown?.();
    this.toggleBlueprintOverlay?.(false);
    this.gameState.prepPhase = false;
    this.gameplayPauseActive = false;
    this.updatePauseHudButton?.();

    this.gameState.gold = Math.max(this.gameState.gold || 0, 99999);

    const pathPoints = Array.isArray(this.path) ? this.path : [];
    const towerDefs = [
      this.towerCatalog?.[0],
      this.towerCatalog?.[1],
      this.towerCatalog?.[2],
    ].filter(Boolean);

    const offsets = [
      { x: sx(88), y: -sy(96) },
      { x: -sx(88), y: sy(96) },
      { x: sx(116), y: sy(22) },
      { x: -sx(116), y: -sy(22) },
      { x: sx(70), y: sy(116) },
      { x: -sx(70), y: -sy(116) },
    ];

    const pickIndices = [0.22, 0.43, 0.66, 0.82]
      .map((ratio) => Math.max(0, Math.min(pathPoints.length - 1, Math.floor((pathPoints.length - 1) * ratio))));
    let placedTowerCount = 0;
    pickIndices.forEach((pointIndex, idx) => {
      const point = pathPoints[pointIndex];
      if (!point || towerDefs.length === 0) {
        return;
      }
      const towerDef = towerDefs[idx % towerDefs.length];
      for (let i = 0; i < offsets.length; i += 1) {
        const attemptX = point.x + offsets[i].x;
        const attemptY = point.y + offsets[i].y;
        if (this.tryPlaceTower(attemptX, attemptY, towerDef)) {
          placedTowerCount += 1;
          break;
        }
      }
    });

    const placeSoldierOnPath = (soldier, distanceRatio) => {
      if (!soldier?.active) {
        return false;
      }

      const soldierSegments = soldier.getData('customPathSegments') || this.pathSegments;
      if (!Array.isArray(soldierSegments) || soldierSegments.length === 0) {
        return false;
      }

      const totalPathLength = soldierSegments.reduce((sum, seg) => sum + (seg?.length || 0), 0);
      const targetDistance = Math.max(0, totalPathLength * distanceRatio);
      let remaining = targetDistance;
      let forcedPathIndex = 0;
      let forcedSegmentDistance = 0;

      for (let i = 0; i < soldierSegments.length; i += 1) {
        const segLength = soldierSegments[i]?.length || 0;
        if (remaining <= segLength) {
          forcedPathIndex = i;
          forcedSegmentDistance = remaining;
          break;
        }
        remaining -= segLength;
        forcedPathIndex = i;
        forcedSegmentDistance = segLength;
      }

      const forcedSegment = soldierSegments[forcedPathIndex];
      if (!forcedSegment) {
        return false;
      }

      const gx = forcedSegment.start.x + (forcedSegment.ux * forcedSegmentDistance);
      const gy = forcedSegment.start.y + (forcedSegment.uy * forcedSegmentDistance);
      soldier.setData('pathIndex', forcedPathIndex);
      soldier.setData('segmentDistance', forcedSegmentDistance);
      soldier.setPosition(gx, gy + (soldier.getData('flightOffsetY') || 0));
      return true;
    };

    const shooter = this.spawnEnemy('soldier', { forcedRouteKey: 'route1' });
    if (!shooter?.active) {
      this.setStatus('TEST: Failed to spawn path shooter.', '#ff8fa7');
      return;
    }

    // Force a visible in-map spawn point for reliable capture and debugging.
    const shooterPlaced = placeSoldierOnPath(shooter, 0.38);
    if (!shooterPlaced) {
      this.setStatus('TEST: Failed to position path shooter.', '#ff8fa7');
      return;
    }

    shooter.setData('singleSoldierPathTest', true);
    shooter.setData('soldierIsGrenadier', false);
    shooter.setData('soldierGrenadeAnim', 'soldierGrenadeCp1');
    shooter.setData('demoAutoFireEveryMs', 240);
    shooter.setData('demoAutoFireAt', (this.time.now || 0) + 280);
    shooter.setData('fireRate', 220);
    shooter.setData('lastFire', 0);
    shooter.setData('attackRange', ENEMY_FIRE_RANGE * 1.28);
    shooter.setData('soldierRecoilRecoverMs', 160);
    shooter.setData('soldierFirePoseMode', 'default');
    shooter.setData('speed', Math.max(42, Number(shooter.getData('speed') || 72) * 0.72));
    shooter.setData('soldierHasRunEnough', true);

    const grenadier = this.spawnEnemy('soldier', { forcedRouteKey: 'route1' });
    if (!grenadier?.active) {
      this.setStatus('TEST: Failed to spawn grenadier.', '#ff8fa7');
      return;
    }

    const grenadierPlaced = placeSoldierOnPath(grenadier, 0.31);
    if (!grenadierPlaced) {
      this.setStatus('TEST: Failed to position grenadier.', '#ff8fa7');
      return;
    }

    grenadier.setData('singleSoldierPathTest', true);
    grenadier.setData('soldierIsGrenadier', true);
    grenadier.setData('soldierRunAnim', 'soldierRunCp1');
    grenadier.setData('soldierCockAnim', 'soldierCockCp1');
    grenadier.setData('soldierAttackAnim', 'soldierFireCp1');
    grenadier.setData('soldierGrenadeAnim', 'soldierGrenadeCp1');
    grenadier.setData('soldierHurtAnim', 'soldierHurtCp1');
    grenadier.setData('soldierSpriteStyle', 'cp1');
    if (this.anims.exists('soldierRunCp1')) {
      grenadier.play('soldierRunCp1', true);
    }
    grenadier.setData('soldierGrenadeCooldownMs', 1400);
    grenadier.setData('soldierGrenadeReadyAt', Math.max(0, (this.time.now || 0) - 1));
    grenadier.setData('fireRate', 1200);
    grenadier.setData('lastFire', 0);
    grenadier.setData('attackRange', ENEMY_FIRE_RANGE * 3.6);
    grenadier.setData('soldierRecoilRecoverMs', 160);
    grenadier.setData('soldierFirePoseMode', 'default');
    grenadier.setData('speed', Math.max(42, Number(grenadier.getData('speed') || 72) * 0.72));
    grenadier.setData('soldierHasRunEnough', true);

    this.updateHud?.();
    this.setStatus('TEST: Shooter front / grenadier behind path run active with ' + placedTowerCount + ' towers.', '#9df8ff');
  },

  canPlaceTowerAt: function (x, y) {
    return Boolean(this.getAvailableTowerBaseAt(x, y));
  },

  _getTerrainSampleCache: function () {
    if (this._terrainSampleData) return this._terrainSampleData;
    if (!this.activeWorldMapKey || !this.textures.exists(this.activeWorldMapKey)) return null;
    try {
      const src = this.textures.get(this.activeWorldMapKey)?.getSourceImage?.();
      if (!src || (!src.width && !src.naturalWidth)) return null;
      const W = 200, H = 112;
      const canvas = document.createElement('canvas');
      canvas.width = W; canvas.height = H;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(src, 0, 0, W, H);
      this._terrainSampleData = { data: ctx.getImageData(0, 0, W, H).data, w: W, h: H };
    } catch (_) { return null; }
    return this._terrainSampleData;
  },

  isOnValidTerrain: function (boardX, boardY) {
    const cache = this._getTerrainSampleCache();
    if (!cache) return true;
    // Full-board proportional mapping — image covers the whole board area
    const nx = Phaser.Math.Clamp(boardX / BOARD_WIDTH, 0, 1);
    const ny = Phaser.Math.Clamp(boardY / BOARD_HEIGHT, 0, 1);
    const px = Math.floor(nx * (cache.w - 1));
    const py = Math.floor(ny * (cache.h - 1));
    const i  = (py * cache.w + px) * 4;
    const r = cache.data[i], g = cache.data[i+1], b = cache.data[i+2];
    const isGreenTerrain = g > r + 5 && g > b + 5 && g > 40;

    // World 2 uses warm sandy terrain instead of green grass.
    if ((this.gameState?.selectedWorldIndex || 0) === 1) {
      const brightness = (r + g + b) / 3;
      const isSandyTerrain = brightness > 42
        && r > 48
        && g > 38
        && r >= g
        && (r - b) > 10
        && b < g + 6;
      const isPurpleShadowTerrain = brightness > 44
        && r > 52
        && b > 52
        && g > 34
        && Math.abs(r - b) < 42
        && b >= g + 8;
      return isGreenTerrain || isSandyTerrain || isPurpleShadowTerrain;
    }

    // Default worlds place on green terrain only.
    return isGreenTerrain;
  },

  getPlacementPathSegments: function () {
    const segmentLists = [];
    if (Array.isArray(this.customSpawnRoutes) && this.customSpawnRoutes.length > 0) {
      this.customSpawnRoutes.forEach((route) => {
        if (Array.isArray(route?.segments) && route.segments.length > 0) {
          segmentLists.push(route.segments);
        }
      });
    } else {
      [this.pathSegments, this.secondaryPathSegments, this.tertiaryPathSegments, this.quaternaryPathSegments].forEach((segments) => {
        if (Array.isArray(segments) && segments.length > 0) {
          segmentLists.push(segments);
        }
      });
    }
    return segmentLists.flat();
  },

  getMinDistanceToPath: function (x, y) {
    const placementSegments = this.getPlacementPathSegments();
    if (!placementSegments || placementSegments.length === 0) {
      return Number.POSITIVE_INFINITY;
    }

    let bestDistance = Number.POSITIVE_INFINITY;
    placementSegments.forEach((segment) => {
      const dist = this.distanceToSegment(x, y, segment.start.x, segment.start.y, segment.end.x, segment.end.y);
      if (dist < bestDistance) {
        bestDistance = dist;
      }
    });
    return bestDistance;
  },

  pointInPolygon: function (x, y, polygon) {
    if (!Array.isArray(polygon) || polygon.length < 3) {
      return false;
    }

    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i].x;
      const yi = polygon[i].y;
      const xj = polygon[j].x;
      const yj = polygon[j].y;
      const intersects = ((yi > y) !== (yj > y))
        && (x < ((xj - xi) * (y - yi)) / ((yj - yi) || 0.0000001) + xi);
      if (intersects) {
        inside = !inside;
      }
    }
    return inside;
  },

  getScaledNoBuildPolygons: function () {
    const layoutId = this.activePathLayoutId || '';
    const sourcePolygons = LAYOUT_NO_BUILD_POLYGONS[layoutId] || [];
    if (!Array.isArray(sourcePolygons) || sourcePolygons.length === 0) {
      return [];
    }

    const layoutMapYOffset = (layoutId === 'delta-cross' || layoutId === 'highland' || layoutId === 'storm-alley' || layoutId === 'double-back' || layoutId === 'reapers-gate')
      ? (Number.isFinite(this.activeWorldMapCoordinateYOffset) ? this.activeWorldMapCoordinateYOffset : 0)
      : 0;
    const cacheKey = 'nobuild::' + layoutId + '::' + MAP_OFFSET_Y + '::' + Math.round(layoutMapYOffset);
    if (this._scaledNoBuildPolygonsCache?.key === cacheKey && Array.isArray(this._scaledNoBuildPolygonsCache.value)) {
      return this._scaledNoBuildPolygonsCache.value;
    }

    const scaled = sourcePolygons
      .filter((poly) => Array.isArray(poly) && poly.length >= 3)
      .map((poly) => poly.map((point) => ({
        x: sx(point.x),
        y: sy(point.y) + MAP_OFFSET_Y + layoutMapYOffset,
      })));

    this._scaledNoBuildPolygonsCache = {
      key: cacheKey,
      value: scaled,
    };
    return scaled;
  },

  getScaledAllowedBuildPolygons: function () {
    const layoutId = this.activePathLayoutId || '';
    const sourcePolygons = LAYOUT_ALLOWED_BUILD_POLYGONS[layoutId] || [];
    if (!Array.isArray(sourcePolygons) || sourcePolygons.length === 0) {
      return [];
    }

    const layoutMapYOffset = (layoutId === 'delta-cross' || layoutId === 'highland' || layoutId === 'storm-alley' || layoutId === 'double-back' || layoutId === 'reapers-gate')
      ? (Number.isFinite(this.activeWorldMapCoordinateYOffset) ? this.activeWorldMapCoordinateYOffset : 0)
      : 0;
    const cacheKey = 'allowbuild::' + layoutId + '::' + MAP_OFFSET_Y + '::' + Math.round(layoutMapYOffset);
    if (this._scaledAllowedBuildPolygonsCache?.key === cacheKey && Array.isArray(this._scaledAllowedBuildPolygonsCache.value)) {
      return this._scaledAllowedBuildPolygonsCache.value;
    }

    const scaled = sourcePolygons
      .filter((poly) => Array.isArray(poly) && poly.length >= 3)
      .map((poly) => poly.map((point) => ({
        x: sx(point.x),
        y: sy(point.y) + MAP_OFFSET_Y + layoutMapYOffset,
      })));

    this._scaledAllowedBuildPolygonsCache = {
      key: cacheKey,
      value: scaled,
    };
    return scaled;
  },

  isInsideNoBuildPolygon: function (x, y) {
    const polygons = this.getScaledNoBuildPolygons();
    if (!Array.isArray(polygons) || polygons.length === 0) {
      return false;
    }

    return polygons.some((polygon) => this.pointInPolygon(x, y, polygon));
  },

  isInsideAllowedBuildPolygon: function (x, y) {
    const polygons = this.getScaledAllowedBuildPolygons();
    if (!Array.isArray(polygons) || polygons.length === 0) {
      return true;
    }

    return polygons.some((polygon) => this.pointInPolygon(x, y, polygon));
  },

  getFreePlacementValidation: function (x, y, ignoreTower = null) {
    const layoutRules = {
      ...DEFAULT_LAYOUT_GAMEPLAY_RULES,
      ...(LAYOUT_GAMEPLAY_RULES[this.activePathLayoutId] || {}),
    };
    const edgePaddingX = sx(22);
    const topPaddingY = sy(70);
    const bottomPaddingY = sy(74);
    const minTowerSpacing = sx(34);
    const minPathClearancePx = Number.isFinite(layoutRules.minPathClearancePx)
      ? layoutRules.minPathClearancePx
      : 22;
    const minPathClearance = sx(minPathClearancePx);
    const enforceMinPathClearance = layoutRules.enforceMinPathClearance !== false;
    const enforceTerrainCheck = layoutRules.enforceTerrainCheck !== false;
    const enforceNoBuildPolygons = layoutRules.enforceNoBuildPolygons !== false;
    const hasAllowedBuildPolygons = this.getScaledAllowedBuildPolygons().length > 0;

    if (!hasAllowedBuildPolygons && (x < edgePaddingX || x > BOARD_WIDTH - edgePaddingX || y < topPaddingY || y > BOARD_HEIGHT - bottomPaddingY)) {
      return { valid: false, reason: 'Invalid position: place on open battlefield, not on HUD or loadout panels.' };
    }

    // If a layout has authored allowed-build polygons, respect them as the source of truth.
    if (hasAllowedBuildPolygons && !this.isInsideAllowedBuildPolygon(x, y)) {
      return { valid: false, reason: 'Invalid position: place inside marked build zones.' };
    }

    if (enforceTerrainCheck && !this.isOnValidTerrain(x, y)) {
      return { valid: false, reason: 'Invalid position: cannot place on rocky terrain or water.' };
    }

    if (enforceMinPathClearance && this.getMinDistanceToPath(x, y) < minPathClearance) {
      return { valid: false, reason: 'Invalid position: keep towers off the paths.' };
    }

    if (enforceNoBuildPolygons && this.isInsideNoBuildPolygon(x, y)) {
      return { valid: false, reason: 'Invalid position: keep towers outside restricted zones.' };
    }

    const tooClose = this.towers?.children?.entries?.some((tower) => {
      if (!tower?.active) {
        return false;
      }
      if (ignoreTower && tower === ignoreTower) {
        return false;
      }
      return Phaser.Math.Distance.Between(x, y, tower.x, tower.y) < minTowerSpacing;
    });
    if (tooClose) {
      return { valid: false, reason: 'Invalid position: too close to another turret.' };
    }

    return { valid: true, reason: '' };
  },

  getAvailableTowerBaseAt: function (x, y) {
    if (this.isFreePlacementEnabled()) {
      const validation = this.getFreePlacementValidation(x, y);
      this.lastPlacementFailureReason = validation.reason;
      if (!validation.valid) {
        return null;
      }

      return {
        x,
        y,
        occupied: false,
        slotIndex: null,
        dynamic: true,
      };
    }

    if (!this.towerBaseSlots) {
      this.lastPlacementFailureReason = 'No tower slots available.';
      return null;
    }

    let bestSlot = null;
    let bestDistance = sx(42);
    this.towerBaseSlots.forEach((slot) => {
      if (slot.occupied) {
        return;
      }
      const distance = Phaser.Math.Distance.Between(x, y, slot.x, slot.y);
      if (distance <= bestDistance) {
        bestDistance = distance;
        bestSlot = slot;
      }
    });

    this.lastPlacementFailureReason = bestSlot ? '' : 'Invalid position: choose a valid placement area.';
    return bestSlot;
  },

  distanceToSegment: function (px, py, x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    if (dx === 0 && dy === 0) {
      return Phaser.Math.Distance.Between(px, py, x1, y1);
    }

    const t = Phaser.Math.Clamp(((px - x1) * dx + (py - y1) * dy) / (dx * dx + dy * dy), 0, 1);
    const cx = x1 + t * dx;
    const cy = y1 + t * dy;
    return Phaser.Math.Distance.Between(px, py, cx, cy);
  },

  buildPathSegments: function (path) {
    const segments = [];
    for (let i = 0; i < path.length - 1; i++) {
      const start = path[i];
      const end = path[i + 1];
      const dx = end.x - start.x;
      const dy = end.y - start.y;
      const length = Math.hypot(dx, dy);
      if (length === 0) {
        continue;
      }

      segments.push({
        start,
        end,
        length,
        ux: dx / length,
        uy: dy / length,
        angle: Phaser.Math.Angle.Between(start.x, start.y, end.x, end.y),
      });
    }
    return segments;
  },

  getSpawnViewportRect: function () {
    const camera = this.cameras?.main;
    if (!camera?.worldView) {
      return new Phaser.Geom.Rectangle(0, 0, BOARD_WIDTH, BOARD_HEIGHT);
    }

    const zoom = Math.max(0.01, camera.zoom || 1);
    const platformMobile = Boolean(window?.__appPlatform?.isMobile)
      || (typeof window !== 'undefined' && window.innerWidth <= 900);
    const leftInset = sx(platformMobile ? 18 : 24) / zoom;
    const rightInset = sx(platformMobile ? 18 : 24) / zoom;
    let topInset = sy(platformMobile ? 112 : 122) / zoom;
    let bottomInset = sy(platformMobile ? 98 : 108) / zoom;

    const canvasRect = this.game?.canvas?.getBoundingClientRect?.();
    if (canvasRect && typeof document !== 'undefined') {
      const unitPerPxY = camera.worldView.height / Math.max(1, canvasRect.height);
      const hudRect = this.htmlHudOverlayNode?.getBoundingClientRect?.()
        || document.getElementById('ab-hud-overlay')?.getBoundingClientRect?.();
      if (hudRect) {
        const hudInsetPx = Math.max(0, hudRect.bottom - canvasRect.top);
        topInset = Math.max(topInset, (hudInsetPx * unitPerPxY) + (sy(4) / zoom));
      }

      const trayEl = this.htmlWeaponTrayRoot?.querySelector?.('#ht-weapon-tray');
      const trayRect = trayEl?.getBoundingClientRect?.();
      if (trayRect) {
        const trayInsetPx = Math.max(0, canvasRect.bottom - trayRect.top);
        bottomInset = Math.max(bottomInset, (trayInsetPx * unitPerPxY) + (sy(4) / zoom));
      }
    }

    const safeX = camera.worldView.x + leftInset;
    const safeY = camera.worldView.y + topInset;
    const safeWidth = Math.max(1, camera.worldView.width - leftInset - rightInset);
    const safeHeight = Math.max(1, camera.worldView.height - topInset - bottomInset);
    return new Phaser.Geom.Rectangle(safeX, safeY, safeWidth, safeHeight);
  },

  isCombatEntityVisible: function (entity, padX = 0, padY = 0) {
    if (!entity?.active) {
      return false;
    }
    const rect = this.getSpawnViewportRect();
    const ex = Number(entity.x) || 0;
    const ey = Number(entity.y) || 0;
    const halfW = Math.max(sx(8), Number(entity.displayWidth || 0) * 0.5);
    const halfH = Math.max(sy(8), Number(entity.displayHeight || 0) * 0.5);
    const minX = ex - halfW;
    const maxX = ex + halfW;
    const minY = ey - halfH;
    const maxY = ey + halfH;

    return !(
      maxX < (rect.x - padX)
      || minX > (rect.x + rect.width + padX)
      || maxY < (rect.y - padY)
      || minY > (rect.y + rect.height + padY)
    );
  },

  clipRouteSegmentToRect: function (start, end, rect) {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    let t0 = 0;
    let t1 = 1;

    const clip = (p, q) => {
      if (p === 0) {
        return q >= 0;
      }
      const ratio = q / p;
      if (p < 0) {
        if (ratio > t1) {
          return false;
        }
        if (ratio > t0) {
          t0 = ratio;
        }
      } else {
        if (ratio < t0) {
          return false;
        }
        if (ratio < t1) {
          t1 = ratio;
        }
      }
      return true;
    };

    if (!clip(-dx, start.x - rect.x)) return null;
    if (!clip(dx, (rect.x + rect.width) - start.x)) return null;
    if (!clip(-dy, start.y - rect.y)) return null;
    if (!clip(dy, (rect.y + rect.height) - start.y)) return null;
    return { tEnter: t0, tExit: t1 };
  },

  getViewportSpawnStateForRoute: function (routePath, routeSegments) {
    if (!Array.isArray(routePath) || routePath.length === 0 || !Array.isArray(routeSegments) || routeSegments.length === 0) {
      return null;
    }

    const rect = this.getSpawnViewportRect();
    const firstPoint = routePath[0];
    if (Phaser.Geom.Rectangle.Contains(rect, firstPoint.x, firstPoint.y)) {
      const firstSegment = routeSegments[0];
      if (firstSegment) {
        const rayLength = Math.max(BOARD_WIDTH, BOARD_HEIGHT) * 2;
        const projectedStart = {
          x: firstSegment.start.x - (firstSegment.ux * rayLength),
          y: firstSegment.start.y - (firstSegment.uy * rayLength),
        };
        const clipped = this.clipRouteSegmentToRect(projectedStart, firstSegment.start, rect);
        if (clipped) {
          const dx = firstSegment.start.x - projectedStart.x;
          const dy = firstSegment.start.y - projectedStart.y;
          const t = Phaser.Math.Clamp(clipped.tEnter, 0, 1);
          const spawnX = projectedStart.x + (dx * t);
          const spawnY = projectedStart.y + (dy * t);
          const spawnDistance = Phaser.Math.Distance.Between(firstSegment.start.x, firstSegment.start.y, spawnX, spawnY);
          return {
            x: spawnX,
            y: spawnY,
            pathIndex: 0,
            // Spawned point is behind the first path node; keep signed distance so movement advances naturally.
            segmentDistance: -Math.max(0, spawnDistance),
          };
        }
      }

      return {
        x: firstPoint.x,
        y: firstPoint.y,
        pathIndex: 0,
        segmentDistance: 0,
      };
    }

    for (let index = 0; index < routeSegments.length; index += 1) {
      const segment = routeSegments[index];
      const clipped = this.clipRouteSegmentToRect(segment.start, segment.end, rect);
      if (!clipped) {
        continue;
      }

      const t = Phaser.Math.Clamp(clipped.tEnter, 0, 1);
      return {
        x: segment.start.x + ((segment.end.x - segment.start.x) * t),
        y: segment.start.y + ((segment.end.y - segment.start.y) * t),
        pathIndex: index,
        segmentDistance: segment.length * t,
      };
    }

    return {
      x: firstPoint.x,
      y: firstPoint.y,
      pathIndex: 0,
      segmentDistance: 0,
    };
  },

  setTowerCompositePosition: function (tower, x, y) {
    if (!tower?.active) {
      return;
    }

    tower.setPosition(x, y);

    const towerBase = tower.getData('towerBase');
    if (towerBase) {
      towerBase.x = x;
      towerBase.y = y;
    }

    const idLabel = tower.getData('idLabel');
    const hpBg = tower.getData('hpBg');
    const hpFill = tower.getData('hpFill');
    const fireAnimSprite = tower.getData('fireAnimSprite');
    const towerFoundation = tower.getData('towerFoundation');
    const towerGroundShadow = tower.getData('towerGroundShadow');

    if (idLabel?.active) {
      idLabel.setPosition(x, y - sy(2));
    }
    if (hpBg?.active) {
      hpBg.setPosition(x, y - sy(30));
    }
    if (hpFill?.active) {
      hpFill.setPosition(x - sx(21), y - sy(30));
    }
    if (fireAnimSprite?.active) {
      fireAnimSprite.setPosition(x, y);
    }
    if (towerFoundation?.active) {
      towerFoundation.setPosition(x, y);
    }
    if (towerGroundShadow?.active) {
      towerGroundShadow.setPosition(x, y + sy(18));
    }
  },

  enablePlacedTowerDrag: function (tower) {
    if (!tower?.active || !this.isFreePlacementEnabled()) {
      return;
    }

    tower.setInteractive({ useHandCursor: true });
    this.input.setDraggable(tower);

    tower.on('pointerdown', () => {
      if (!tower?.active || this.draggingFromTray || this.isMultiplayerEnemyCommanderRole?.()) {
        return;
      }
      this.focusPlacedTower(tower);
    });

    tower.on('dragstart', (pointer) => {
      if (this.gameState?.gameOver || this.draggingFromTray || this.isMultiplayerEnemyCommanderRole?.()) {
        tower.setData('isDraggingTower', false);
        return;
      }

      tower.setData('isDraggingTower', true);
      tower.setData('dragOriginX', tower.x);
      tower.setData('dragOriginY', tower.y);
      tower.setDepth(2.12);
    });

    tower.on('drag', (pointer, dragX, dragY) => {
      if (!tower.getData('isDraggingTower')) {
        return;
      }
      this.setTowerCompositePosition(tower, dragX, dragY);
    });

    tower.on('dragend', () => {
      if (!tower.getData('isDraggingTower')) {
        return;
      }

      tower.setData('isDraggingTower', false);
      tower.setDepth(2);

      const validation = this.getFreePlacementValidation(tower.x, tower.y, tower);
      if (validation.valid) {
        this.setStatus('Turret repositioned.', '#89ffd0');
        return;
      }

      const fallbackX = tower.getData('dragOriginX') ?? tower.x;
      const fallbackY = tower.getData('dragOriginY') ?? tower.y;
      this.setTowerCompositePosition(tower, fallbackX, fallbackY);
      this.setStatus(validation.reason || 'Invalid position: choose a valid placement area.', '#ffb18b');
    });
  },

  tryPlaceTower: function (x, y, towerDef = null) {
    return tryPlaceTowerSystem.call(this, x, y, towerDef, { vibrateImpact });
  },

  getTowerDefinitionForPlacement: function (selectedTower) {
    if (!selectedTower) {
      return null;
    }

    const testWeaponId = DEBUG_FLAGS.tower1TestWeaponId || 0;
    if (selectedTower.id !== 1 || testWeaponId <= 1) {
      return selectedTower;
    }

    const override = this.towerCatalog.find((tower) => tower.id === testWeaponId);
    if (!override) {
      return selectedTower;
    }

    return override;
  },

  startWave: function () {
    const result = startGameWave.call(this);

    const isLandingAttractMode = typeof window !== 'undefined' && window.__landingAttractMode === true;
    if (isLandingAttractMode) {
      this.landingAttractLoopTimer?.remove?.(false);
      this.landingAttractLoopTimer = this.time.delayedCall(300000, () => {
        if (this.gameState?.gameOver) {
          return;
        }

        const activeEnemies = [...(this.enemies?.children?.entries || [])];
        activeEnemies.forEach((enemy) => {
          if (!enemy?.active) {
            return;
          }
          this.destroyEnemyVisuals?.(enemy);
          enemy.destroy();
        });

        [...(this.projectiles?.children?.entries || [])].forEach((projectile) => projectile?.active && projectile.destroy());
        [...(this.enemyProjectiles?.children?.entries || [])].forEach((projectile) => projectile?.active && projectile.destroy());

        this.stopThemeMusic();
        this.gameState.gameOver = false;
        this.gameState.wave = 1;
        this.gameState.level = 1;
        this.gameState.lives = 9999;
        this.playerLightningReadyAt = 0;
        this.waveLeaksThisWave = 0;
        this.enemiesSpawned = 0;
        this.enemiesResolved = 0;
        this.enemiesDefeated = 0;
        this.enemyCount = 0;
        this.applyFortressLayoutForWave(1);
        this.applyPathLayoutForWave(1, true);
        this.refreshLightningBlobControl?.();
        this.startWave();
      });
    }

    return result;
  },

  getEnemyPathDistance: function (enemy) {
    if (!enemy || !enemy.active) {
      return 0;
    }

    if (enemy.getData('isPlane')) {
      return enemy.getData('planeTravelDistance') || 0;
    }

    const pathIndex = enemy.getData('pathIndex') || 0;
    const segmentDistance = enemy.getData('segmentDistance') || 0;
    const pathSegments = enemy.getData('customPathSegments') || this.pathSegments;
    let totalDistance = segmentDistance;
    for (let i = 0; i < pathIndex; i += 1) {
      totalDistance += pathSegments[i]?.length || 0;
    }
    return totalDistance;
  },

  spawnEnemy: function (enemyType = 'soldier', spawnStep = null) {
    return spawnGameEnemy.call(this, enemyType, spawnStep);
  },

  resolveWaveEnemy: function () {
    if (this.gameState?.gameOver) {
      return;
    }

    this.enemiesResolved += 1;

    if (this.isMultiplayerModeEnabled?.() && this.multiplayerRuntime?.waveActive) {
      // Multiplayer has its own wave runtime resolution path.
      return;
    }

    if (this.enemiesResolved >= this.enemyCount && this.enemyCount > 0) {
      this.nextWave();
    }
  },

  getEffectivePlayerLevel: function () {
    if (DEBUG_FLAGS.developerUnlocksMaxed) {
      return 99;
    }
    return Math.max(1, this.gameState?.playerLevel || 1);
  },

  isWeaponUnlockedForPlayer: function (towerDef) {
    if (!towerDef) {
      return false;
    }
    // Online-exclusive weapons bypass the player-level gate entirely.
    if (ONLINE_EXCLUSIVE_WEAPON_IDS.has(towerDef.id)) {
      return this.isOnlineWeaponUnlocked(towerDef.id);
    }
    return this.getEffectivePlayerLevel() >= (towerDef.unlockLevel || 1);
  },

  isOnlineWeaponUnlocked: function (weaponId) {
    return isOnlineWeaponUnlockedSystem.call(this, weaponId);
  },

  checkOnlineWeaponUnlocks: function (options = {}) {
    return checkOnlineWeaponUnlocksSystem.call(this, options);
  },

  updateWeaponUnlockState: function () {
    this.renderWeaponCarousel();
    if (this.selectedTowerDef && this.isWeaponUnlockedForPlayer(this.selectedTowerDef)) {
      this.selectTowerDef(this.selectedTowerDef);
      return;
    }

    const fallback = this.towerCatalog.find((tower) => this.isWeaponUnlockedForPlayer(tower)) || this.towerCatalog[0] || null;
    this.selectTowerDef(fallback);
  },

  calculateWaveCompletionGoldBonus: function (completedWave) {
    const wave = Math.max(1, Number(completedWave || 1));
    const diff = this.getDifficultyConfig();
    const difficultyBonusByMode = {
      easy: 8,
      normal: 20,
      hard: 34,
    };
    const difficultyBonus = difficultyBonusByMode[this.gameState?.selectedDifficulty] || 0;
    const configuredWaveBonus = Math.max(0, Number(diff?.waveBonus || 0));

    const leaksThisWave = Math.max(0, Number(this.waveLeaksThisWave || 0));
    const leakBonus = leaksThisWave === 0 ? 30 : Math.max(-32, 14 - (leaksThisWave * 9));

    const waveStartMs = Number(this.waveStartedAtMs || 0);
    const elapsedSec = waveStartMs > 0
      ? Math.max(1, (this.time.now - waveStartMs) / 1000)
      : 60;
    const targetSec = Math.max(18, 42 - (wave * 1.15));
    const speedRatio = targetSec / elapsedSec;
    const speedBonus = Math.max(-8, Math.min(36, Math.round((speedRatio - 1) * 36)));

    const defeatedThisWave = Math.max(0, Number(this.enemiesDefeated || 0));
    const pressureBonus = Math.min(34, Math.floor(defeatedThisWave / 10));

    const wallet = Math.max(0, Number(this.gameState?.gold || 0));
    const comebackBonus = wallet < 260 ? 32 : (wallet < 460 ? 14 : 0);

    const waveBase = 120 + (wave * 28) + (configuredWaveBonus * 3);
    const rawBonus = waveBase + difficultyBonus + leakBonus + speedBonus + pressureBonus + comebackBonus;
    const diffScalar = Math.max(0.7, Math.min(1.35, Number(diff?.scoreMultiplier || 1)));
    const scaled = Math.round(rawBonus * (0.95 + (diffScalar * 0.07)));
    return Math.max(85, Math.min(620, scaled));
  },

  handleWaveCompletionProgression: function (completedWave) {
    const waveGoldBonus = this.calculateWaveCompletionGoldBonus(completedWave);
    this.gameState.gold += waveGoldBonus;
    this.lastWaveCompletionGoldBonus = waveGoldBonus;

    // Commander XP for completing a wave
    this.earnCommanderXP(COMMANDER_XP_PER_WAVE);

    // Every WAVES_PER_PLAYER_LEVEL waves — player levels up
    if (completedWave <= 0 || (completedWave % WAVES_PER_PLAYER_LEVEL) !== 0) {
      this.updateHud();
      return;
    }

    if (!DEBUG_FLAGS.developerUnlocksMaxed) {
      this.gameState.playerLevel += 1;
      this.setStatus('Level up! Player level ' + this.gameState.playerLevel + ' reached.', '#89ffd0');
    }

    this.updateWeaponUnlockState();
    this.updateHud();

    // Wave 10 = world cleared (2 full player-level cycles)
    if (completedWave >= 10) {
      const worldId = this.gameState.selectedWorldIndex;
      this.recordWorldCleared(worldId);
      this.earnCommanderXP(COMMANDER_XP_PER_CLEAR);
    }
  },

  handleEnemyLeak: function (enemy) {
    this.destroyEnemyVisuals(enemy);
    enemy.destroy();
    this.gameState.lives -= 1;
    this.waveLeaksThisWave = Math.max(0, Number(this.waveLeaksThisWave || 0) + 1);
    this.updateHud();
    if (this.gameState.lives <= 0) {
      if (this.isMultiplayerEnemyCommanderRole?.()) {
        this.gameState.attackEndReason = 'coreBreach';
      }
      this.endGame();
      return;
    }
    this.resolveWaveEnemy();
    this.setStatus('An enemy slipped through the barricade.', '#ff8fa7');
  },

  getPlaneLaneWorldY: function (lane = 'middle') {
    const hudTop = sy(14);
    const hudHeight = sy(78);
    const trayBottomGap = sy(14);
    const trayHeight = sy(86);
    const trayTop = BOARD_HEIGHT - trayBottomGap - trayHeight;
    const gameplayTop = hudTop + hudHeight + sy(52);
    const gameplayBottom = trayTop - sy(52);
    const laneRatios = {
      top: 0.24,
      middle: 0.5,
      bottom: 0.76,
    };
    const ratio = laneRatios[lane] ?? laneRatios.middle;
    return Phaser.Math.Linear(gameplayTop, gameplayBottom, ratio);
  },

  updatePlaneEnemyFlight: function (enemy, deltaSeconds) {
    if (!enemy?.active) {
      return;
    }

    const direction = enemy.getData('planeDirection') === 'west' ? 'west' : 'east';
    const directionSign = direction === 'west' ? -1 : 1;
    const travelStep = (enemy.getData('speed') || 0) * deltaSeconds;
    const laneY = this.getPlaneLaneWorldY(enemy.getData('planeLane') || 'middle');
    const laneOffsetY = Number(enemy.getData('planeLaneOffsetY')) || 0;
    const pulse = enemy.getData('pulsePhase') || 0;
    const bobOffset = Math.sin((this.time.now * 0.0054) + pulse) * sy(5);
    const hudTop = sy(14);
    const hudHeight = sy(78);
    const trayBottomGap = sy(14);
    const trayHeight = sy(86);
    const trayTop = BOARD_HEIGHT - trayBottomGap - trayHeight;
    const gameplayTop = hudTop + hudHeight + sy(40);
    const gameplayBottom = trayTop - sy(40);

    enemy.x += directionSign * travelStep;
    enemy.y = Phaser.Math.Clamp(laneY + laneOffsetY + bobOffset, gameplayTop, gameplayBottom);
    enemy.setRotation(direction === 'west' ? -(Math.PI / 2) : (Math.PI / 2));
    enemy.setData('planeTravelDistance', (enemy.getData('planeTravelDistance') || 0) + travelStep);

    const frameKeys = enemy.getData('planeFrameKeys') || PLANE_ENEMY_VARIANTS[0].frameKeys;
    const nextFrameAt = enemy.getData('planeFrameNextAt') || 0;
    if (this.time.now >= nextFrameAt) {
      const nextFrameIndex = ((enemy.getData('planeFrameIndex') || 0) + 1) % frameKeys.length;
      enemy.setTexture(frameKeys[nextFrameIndex]);
      enemy.setData('planeFrameIndex', nextFrameIndex);
      enemy.setData('planeFrameNextAt', this.time.now + 92);
    }

    const shadow = enemy.getData('shadow');
    const barBg = enemy.getData('barBg');
    const barFill = enemy.getData('barFill');
    if (shadow) {
      shadow.setPosition(enemy.x, laneY + laneOffsetY + (enemy.getData('shadowOffsetY') || sy(42)));
    }
    if (barBg) {
      barBg.setPosition(enemy.x, enemy.y + (enemy.getData('barOffsetY') || -sy(34)));
    }
    if (barFill) {
      barFill.setPosition(enemy.x - sx(14), enemy.y + (enemy.getData('barOffsetY') || -sy(34)));
    }

    const outOfBounds = direction === 'east'
      ? enemy.x > BOARD_WIDTH + sx(92)
      : enemy.x < -sx(92);
    if (outOfBounds) {
      this.handleEnemyLeak(enemy);
    }
  },

  moveEnemiesAlongPath: function () {
    return moveGameEnemiesAlongPath.call(this);
  },

  isSoldierTargetVisible: function (enemy, tower, rangeMult = 1) {
    if (!enemy?.active || !tower?.active) {
      return false;
    }
    if (!this.isCombatEntityVisible(enemy, sx(10), sy(10))) {
      return false;
    }
    const towerBase = tower.getData('towerBase');
    const towerAimX = Number.isFinite(towerBase?.x) ? towerBase.x : tower.x;
    const towerAimY = Number.isFinite(towerBase?.y) ? towerBase.y : tower.y;
    const attackRange = enemy.getData('attackRange') || ENEMY_FIRE_RANGE;
    const distance = Phaser.Math.Distance.Between(enemy.x, enemy.y, towerAimX, towerAimY);
    if (distance > (attackRange * Math.max(0.5, Number(rangeMult) || 1))) {
      return false;
    }

    if (enemy.getData('isSoldier')) {
      const activeSegs = enemy.getData('customPathSegments')
        || ((enemy.getData('useSecondaryPath') && this.secondaryPathSegments)
          ? this.secondaryPathSegments
          : (enemy.getData('useTertiaryPath') && this.tertiaryPathSegments)
            ? this.tertiaryPathSegments
            : (enemy.getData('useQuaternaryPath') && this.quaternaryPathSegments)
              ? this.quaternaryPathSegments
              : this.pathSegments);
      const pathIndex = enemy.getData('pathIndex') || 0;
      const segment = activeSegs?.[pathIndex] || null;
      if (segment) {
        const dx = towerAimX - enemy.x;
        const dy = towerAimY - enemy.y;
        const forwardProj = (dx * segment.ux) + (dy * segment.uy);
        const lateralProj = Math.abs((-segment.uy * dx) + (segment.ux * dy));
        if (forwardProj < sx(8) || lateralProj > sx(82)) {
          return false;
        }
      }
    }

    // Use torso position for stricter horizontal alignment check
    const soldierFeetY = this.getSoldierFeetY(enemy);
    const towerFeetY = this.getTowerFeetY(tower);
    const feetLineToleranceY = sy(30);
    if (Math.abs(soldierFeetY - towerFeetY) > feetLineToleranceY) {
      return false;
    }

    return true;
  },

  getTowerTargetPoint: function (tower) {
    if (!tower?.active) {
      return null;
    }
    const towerBase = tower.getData('towerBase');
    return {
      x: Number.isFinite(towerBase?.x) ? towerBase.x : tower.x,
      y: Number.isFinite(towerBase?.y) ? towerBase.y : tower.y,
    };
  },

  getTowerFeetY: function (tower) {
    if (!tower?.active) {
      return 0;
    }

    const towerBase = tower.getData('towerBase');
    const baseY = Number.isFinite(towerBase?.y) ? towerBase.y : null;
    const displayHeight = Number(tower.displayHeight || 0);
    const spriteFeetY = Number.isFinite(displayHeight) && displayHeight > 0
      ? tower.y + (displayHeight * 0.46)
      : tower.y;

    if (!Number.isFinite(baseY)) {
      return spriteFeetY;
    }
    return Math.max(baseY, spriteFeetY);
  },

  getSoldierFeetY: function (enemy) {
    if (!enemy?.active) {
      return 0;
    }
    const displayHeight = Number(enemy.displayHeight || 0);
    if (!Number.isFinite(displayHeight) || displayHeight <= 0) {
      return enemy.y;
    }
    // Center origin sprite: estimate feet slightly above bottom edge.
    return enemy.y + (displayHeight * 0.48);
  },

  canGrenadierThrowAtTarget: function (enemy, tower) {
    if (!enemy?.active || !tower?.active || !enemy.getData('soldierIsGrenadier')) {
      return false;
    }
    if (!this.isCombatEntityVisible(enemy, sx(10), sy(10))) {
      return false;
    }

    const targetPoint = this.getTowerTargetPoint(tower);
    if (!targetPoint) {
      return false;
    }

    const facingLeft = targetPoint.x < enemy.x;
    const muzzle = this.getSoldierMuzzleWorldPosition(enemy, {
      phaseHint: 'grenade',
      facingLeft,
    });

    const dxSigned = targetPoint.x - muzzle.x;
    const dx = Math.abs(dxSigned);
    const dy = targetPoint.y - muzzle.y;
    const directDistance = Math.hypot(dxSigned, dy);
    const attackRange = enemy.getData('attackRange') || ENEMY_FIRE_RANGE;

    // Hard cap keeps throws local and avoids unrealistic long-range lob spam.
    // Grenadiers should pressure nearby defenders, not cross-map towers.
    if (directDistance > (attackRange * 0.6) || directDistance > sx(180)) {
      return false;
    }

    // Grenade launch speed mirrors spawnEnemyProjectile soldier grenade setup.
    const launchSpeed = ENEMY_PROJECTILE_SPEED * 0.56 * 4;
    const gravityY = 320;
    const v2 = launchSpeed * launchSpeed;
    const discriminant = (v2 * v2) - (gravityY * ((gravityY * dx * dx) + (2 * dy * v2)));
    if (discriminant < 0) {
      return false;
    }

    // Validate time-to-impact for viable arcs so throws don't trigger when the
    // shot would take too long to practically connect.
    const sqrtDisc = Math.sqrt(discriminant);
    const tan1 = (v2 + sqrtDisc) / (gravityY * Math.max(0.001, dx));
    const tan2 = (v2 - sqrtDisc) / (gravityY * Math.max(0.001, dx));
    const theta1 = Math.atan(tan1);
    const theta2 = Math.atan(tan2);
    const cos1 = Math.cos(theta1);
    const cos2 = Math.cos(theta2);
    const t1 = cos1 > 0.001 ? (dx / (launchSpeed * cos1)) : Number.POSITIVE_INFINITY;
    const t2 = cos2 > 0.001 ? (dx / (launchSpeed * cos2)) : Number.POSITIVE_INFINITY;
    const flightTime = Math.min(t1, t2);

    return Number.isFinite(flightTime) && flightTime > 0 && flightTime <= 0.72;
  },

  updateEnemyFire: function () {
    const now = this.time.now;
    const soldierTargetCap = 2;
    const soldierAssignmentsByTower = new Map();
    const isInfantryShooter = (enemy) => !!enemy?.getData?.('isSoldier') || !!enemy?.getData?.('isEliteSoldier');
    const reserveSoldierTarget = (tower) => {
      if (!tower) {
        return;
      }
      soldierAssignmentsByTower.set(tower, (soldierAssignmentsByTower.get(tower) || 0) + 1);
    };
    const canAssignSoldierTarget = (tower) => {
      if (!tower) {
        return false;
      }
      return (soldierAssignmentsByTower.get(tower) || 0) < soldierTargetCap;
    };

    this.enemies.children.entries.forEach((enemy) => {
      if (enemy.getData('isTestDummy')) {
        return;
      }
      if (enemy.getData('isDying')) {
        return;
      }

      const range = enemy.getData('attackRange') || ENEMY_FIRE_RANGE;
      const isSoldier = isInfantryShooter(enemy);
      const isGrenadier = isSoldier && !!enemy.getData('soldierIsGrenadier');
      const grenadeReady = isGrenadier && now >= (enemy.getData('soldierGrenadeReadyAt') || 0);
      if (isSoldier && !enemy.getData('soldierHasRunEnough')) {
        enemy.setData('soldierTargetLockedUntil', 0);
        enemy.setData('soldierAttackTarget', null);
        enemy.setData('currentAttackTarget', null);
        return;
      }
      let closestTower = null;
      let closestDistance = range;

      if (isSoldier) {
        const targetStickRange = range * 1.15;
        const lockedTarget = enemy.getData('soldierAttackTarget');
        if (
          lockedTarget?.active
          && this.isSoldierTargetVisible(enemy, lockedTarget, 1.15)
          && canAssignSoldierTarget(lockedTarget)
        ) {
          const lockedPoint = this.getTowerTargetPoint(lockedTarget);
          const lockedDist = lockedPoint
            ? Phaser.Math.Distance.Between(enemy.x, enemy.y, lockedPoint.x, lockedPoint.y)
            : Number.POSITIVE_INFINITY;
          const grenadeThrowIsFeasible = !isGrenadier
            || !grenadeReady
            || this.canGrenadierThrowAtTarget(enemy, lockedTarget);
          if (lockedDist <= targetStickRange && grenadeThrowIsFeasible) {
            closestTower = lockedTarget;
            closestDistance = lockedDist;
          }
        }
      }

      if (!closestTower) {
        this.towers.children.entries.forEach((tower) => {
          if (!tower.active) {
            return;
          }
          if (isSoldier && !canAssignSoldierTarget(tower)) {
            return;
          }
          if (isSoldier && !enemy.getData('soldierIsGrenadier') && !this.isSoldierTargetVisible(enemy, tower, 1)) {
            return;
          }
          if (isGrenadier && grenadeReady && !this.canGrenadierThrowAtTarget(enemy, tower)) {
            return;
          }
          const towerPoint = this.getTowerTargetPoint(tower);
          if (!towerPoint) {
            return;
          }
          const dist = Phaser.Math.Distance.Between(enemy.x, enemy.y, towerPoint.x, towerPoint.y);
          if (dist < closestDistance) {
            closestTower = tower;
            closestDistance = dist;
          }
        });
      }

      if (!closestTower) {
        if (isSoldier) {
          enemy.setData('soldierTargetLockedUntil', 0);
          enemy.setData('soldierAttackTarget', null);
        }
        enemy.setData('currentAttackTarget', null);
        return;
      }

      enemy.setData('currentAttackTarget', closestTower);
      if (isSoldier) {
        enemy.setData('soldierAttackTarget', closestTower);
        enemy.setData('soldierTargetLockedUntil', now + 220);
        reserveSoldierTarget(closestTower);
      }

      const lastFire = enemy.getData('lastFire') || 0;
      const fireRate = enemy.getData('fireRate') || ENEMY_FIRE_RATE;
      const effectiveFireRate = isSoldier
        ? Math.max(90, fireRate * 0.66)
        : fireRate;
      if (now - lastFire < effectiveFireRate) {
        return;
      }

      const fired = this.fireEnemyProjectile(enemy, closestTower);
      if (fired && !isSoldier) {
        enemy.setData('lastFire', now);
      }
    });
  },

  fireEnemyProjectile: function (enemy, tower) {
    if (!tower?.active) {
      return false;
    }
    const towerTarget = this.getTowerTargetPoint(tower);
    if (!towerTarget) {
      return false;
    }
    const soldierMuzzle = enemy.getData('isSoldier')
    ? this.getSoldierMuzzleWorldPosition(enemy)
    : null;
    const aimFromX = soldierMuzzle?.x ?? enemy.x;
    const aimFromY = soldierMuzzle?.y ?? enemy.y;
    const baseAngle = Phaser.Math.RadToDeg(
      Phaser.Math.Angle.Between(aimFromX, aimFromY, towerTarget.x, towerTarget.y)
    );

    const isTank = enemy.getData('enemyType') === 'tank';
    const isHumvee = !!enemy.getData('isHumvee');
    const isElite = enemy.getData('isEliteSoldier');
    const isPlane = enemy.getData('isPlane');
    const isSoldier = enemy.getData('isSoldier');

    if (isSoldier) {
      const now = this.time.now || 0;
      const isGrenadier = !!enemy.getData('soldierIsGrenadier');
      if (!isGrenadier && !this.isSoldierTargetVisible(enemy, tower, 1.15)) {
        enemy.setData('soldierTargetLockedUntil', 0);
        enemy.setData('soldierAttackTarget', null);
        return false;
      }
      const attackRange = enemy.getData('attackRange') || ENEMY_FIRE_RANGE;
      const grenadeReadyAt = enemy.getData('soldierGrenadeReadyAt') || 0;
      const emitSoldierBurst = (baseFireAngle, muzzlePos) => {
        const origin = muzzlePos || this.getSoldierMuzzleWorldPosition(enemy, {
          phaseHint: 'fire',
          facingLeft: !!enemy.getData('soldierAimLockedFlip'),
          angleDeg: baseFireAngle,
        });
        const damageFactor = isElite ? 0.98 : 0.72;
        this.spawnEnemyProjectile(enemy, baseFireAngle, damageFactor, {
          spawnX: origin.x,
          spawnY: origin.y,
        });
      };

      const lockedFlip = towerTarget.x < enemy.x;
      // Only update flip if not already aim-locked to prevent mid-burst flipping
      const aimLocked = ((enemy.getData('soldierAimLockUntil') || 0) > now);
      if (!aimLocked && enemy.getData('soldierCanFlip')) {
        enemy.setFlipX(lockedFlip);
        enemy.setData('soldierAimLockedFlip', lockedFlip);
      }
      const lockedAngle = Phaser.Math.RadToDeg(
        Phaser.Math.Angle.Between(aimFromX, aimFromY, towerTarget.x, towerTarget.y),
      );

      enemy.setData('soldierAimLockedAngle', lockedAngle);
      // Grenadiers lock aim for their full cooldown to prevent flip-flop between throws
      const aimLockDuration = isGrenadier ? (enemy.getData('soldierGrenadeCooldownMs') || 600) + 200 : 600;
      enemy.setData('soldierAimLockUntil', now + aimLockDuration);
      const verticalFireAnim = this.getSoldierVerticalFireAnimKey(enemy, towerTarget);
      if (verticalFireAnim) {
        enemy.setData('soldierAttackAnim', verticalFireAnim);
      }

      if (isGrenadier && !isElite && now >= grenadeReadyAt) {
        if (!this.canGrenadierThrowAtTarget(enemy, tower)) {
          enemy.setData('soldierTargetLockedUntil', 0);
          enemy.setData('soldierAttackTarget', null);
          return false;
        }
        // Always face the actual target when throwing — override any stale lock
        if (enemy.getData('soldierCanFlip')) {
          enemy.setFlipX(lockedFlip);
          enemy.setData('soldierAimLockedFlip', lockedFlip);
        }
        this.triggerSoldierGrenadePose(enemy);
        enemy.setData('lastFire', this.time.now || now);
        enemy.setData('soldierGrenadeReadyAt', now + (enemy.getData('soldierGrenadeCooldownMs') || 600));
        // Delay projectile spawn to match throw release (~frame 5 of 8 at 12fps ≈ 400ms)
        this.time.delayedCall(400, () => {
          if (!enemy?.active || enemy.getData('isDying') || !tower?.active) return;
          if (!this.isCombatEntityVisible(enemy, sx(10), sy(10))) {
            enemy.setData('soldierTargetLockedUntil', 0);
            enemy.setData('soldierAttackTarget', null);
            return;
          }
          // Target can become unhittable during wind-up (movement/angle/range changes).
          // Cancel and refund grenade readiness so the grenadier can retarget immediately.
          if (!this.canGrenadierThrowAtTarget(enemy, tower)) {
            enemy.setData('soldierGrenadeReadyAt', now);
            enemy.setData('soldierTargetLockedUntil', 0);
            enemy.setData('soldierAttackTarget', null);
            return;
          }
          const grenadeMuzzle = this.getSoldierMuzzleWorldPosition(enemy, {
            phaseHint: 'grenade',
            facingLeft: lockedFlip,
            angleDeg: lockedAngle,
          });
          const liveGrenadeTarget = this.getTowerTargetPoint(tower) || towerTarget;
          const grenadeBaseAngle = Phaser.Math.RadToDeg(
            Phaser.Math.Angle.Between(grenadeMuzzle.x, grenadeMuzzle.y, liveGrenadeTarget.x, liveGrenadeTarget.y),
          );
          const grenadeAngles = [
            grenadeBaseAngle + Phaser.Math.Between(-2, -1),
            grenadeBaseAngle + Phaser.Math.Between(1, 2),
          ];
          grenadeAngles.forEach((grenadeAngle) => {
            this.spawnEnemyProjectile(enemy, grenadeAngle, 0.82, {
              speed: ENEMY_PROJECTILE_SPEED * 0.56,
              scaleMult: 1.72,
              textureKey: 'grenade_01',
              alpha: 1.0,
              spawnX: grenadeMuzzle.x,
              spawnY: grenadeMuzzle.y,
              isGrenade: true,
              targetTower: tower,
              explosionFrames: SOLDIER_DEATH_EXPLOSION_FRAMES,
              explosionScale: 1.36,
              explosionFlashRadius: sx(36),
              explosionFlashColor: 0xffa85a,
            });
          });
        });
        return true;
      }

      if (isGrenadier && !isElite) {
        // Grenadiers do not switch to rifle fire while grenade is recharging.
        return false;
      }

      // Shooter only fires when torso is on the same horizontal line as the target
      if (!isElite) {
        const torsoY = enemy.y - (enemy.displayHeight || 0) * 0.05;
        if (Math.abs(towerTarget.y - torsoY) > sy(92)) {
          return false;
        }
      }

      const started = this.triggerSoldierFirePose(enemy, () => {
        if (!enemy?.active || enemy.getData('isDying')) {
          return;
        }
        if (!tower?.active) {
          enemy.setData('soldierTargetLockedUntil', 0);
          enemy.setData('soldierAttackTarget', null);
          return;
        }
        if (!this.isSoldierTargetVisible(enemy, tower, 1.15)) {
          enemy.setData('soldierTargetLockedUntil', 0);
          enemy.setData('soldierAttackTarget', null);
          return;
        }
        const liveTarget = this.getTowerTargetPoint(tower);
        if (!liveTarget) {
          enemy.setData('soldierTargetLockedUntil', 0);
          enemy.setData('soldierAttackTarget', null);
          return;
        }
        const frameIndex = Number(enemy.anims?.currentFrame?.index || 1);
        const frameCount = Number(enemy.anims?.currentAnim?.frames?.length || 1);
        const muzzleForAim = this.getSoldierMuzzleWorldPosition(enemy, {
          phaseHint: 'fire',
          facingLeft: !!enemy.getData('soldierAimLockedFlip'),
        });
        const frameLockedAngle = Phaser.Math.RadToDeg(
          Phaser.Math.Angle.Between(muzzleForAim.x, muzzleForAim.y, liveTarget.x, liveTarget.y),
        );
        enemy.setData('soldierAimLockedAngle', frameLockedAngle);
        enemy.setData('lastFire', this.time.now || now);
        const currentBaseAngle = Number(enemy.getData('soldierAimLockedAngle'));
        if (enemy.getData('soldierCanFlip')) {
          enemy.setFlipX(!!enemy.getData('soldierAimLockedFlip'));
        }
        const fireAngle = Number.isFinite(currentBaseAngle)
          ? currentBaseAngle
          : this.getSoldierBarrelAimAngle(enemy, 'fire');
        const muzzleNow = this.getSoldierMuzzleWorldPosition(enemy, {
          phaseHint: 'fire',
          facingLeft: !!enemy.getData('soldierAimLockedFlip'),
          angleDeg: fireAngle,
        });

        emitSoldierBurst(fireAngle, muzzleNow);
      });
      if (!started) {
        emitSoldierBurst(lockedAngle);
        enemy.setData('lastFire', this.time.now || now);
        enemy.setData('soldierAimLockUntil', 0);
        return true;
      }
      return started;
    }

    if (isTank || isHumvee || isElite) {
      const spread = isElite ? [-10, 0, 10] : [-7, 0, 7];
      const damageFactors = [0.52, 0.72, 0.52];

      // Compute barrel-tip spawn position
      let fireFromX = enemy.x;
      let fireFromY = enemy.y;

      if (isHumvee) {
        const humveeGun = enemy.getData('humveeGun');
        if (humveeGun?.active) {
          // humveeGun.rotation = aimAngle + π/2, so aimAngle = rotation - π/2
          const aimAngle = (humveeGun.rotation || 0) - Math.PI / 2;
          const barrelDist = sy(14);
          fireFromX = enemy.x + Math.cos(aimAngle) * barrelDist;
          fireFromY = enemy.y + Math.sin(aimAngle) * barrelDist;
        }
      } else if (isTank) {
        const tankGun = enemy.getData('tankGun');
        if (tankGun?.active) {
          // tankGun.rotation = enemy.rotation = pathAngle + π/2, so aimAngle = rotation - π/2
          const aimAngle = (tankGun.rotation || 0) - Math.PI / 2;
          const barrelDist = sy(18);
          fireFromX = tankGun.x + Math.cos(aimAngle) * barrelDist;
          fireFromY = tankGun.y + Math.sin(aimAngle) * barrelDist;
        }
      }

      spread.forEach((offset, index) => {
        this.spawnEnemyProjectile(enemy, baseAngle + offset, damageFactors[index], {
          spawnX: fireFromX,
          spawnY: fireFromY,
        });
      });
      return true;
    }

    if (isPlane) {
      this.playPlaneTierSfx(enemy);
      const planeDirection = enemy.getData('planeDirection') === 'west' ? 'west' : 'east';
      const forwardAngle = planeDirection === 'west' ? 180 : 0;
      const spread = enemy.getData('planeVolleyAngles') || [-7, 0, 7];
      const damageFactor = spread.length >= 4 ? 0.46 : (spread.length >= 3 ? 0.58 : 0.72);
      spread.forEach((offset) => {
        this.spawnEnemyProjectile(enemy, forwardAngle + offset, damageFactor);
      });

      const canDropBomb = !!enemy.getData('planeCanDropBomb');
      const lastBombAt = enemy.getData('planeLastBombAt') || 0;
      const bombCooldown = enemy.getData('planeBombCooldown') || 1200;
      if (canDropBomb && (this.time.now - lastBombAt) >= bombCooldown) {
        const bombDamageMult = enemy.getData('planeBombDamageMult') || 1.4;
        const bombBurstCount = Math.max(1, Math.floor(enemy.getData('planeBombBurstCount') || 1));
        const bombBlastRadius = Number(enemy.getData('planeBombBlastRadius')) || sx(74);
        const burstSpreadDeg = bombBurstCount >= 3 ? 20 : (bombBurstCount === 2 ? 14 : 0);
        for (let idx = 0; idx < bombBurstCount; idx += 1) {
          const offset = bombBurstCount === 1
            ? 0
            : ((idx - ((bombBurstCount - 1) / 2)) * burstSpreadDeg);
          const bombAngle = Phaser.Math.Angle.WrapDegrees(baseAngle + offset + Phaser.Math.Between(-4, 4));
          this.spawnEnemyProjectile(enemy, bombAngle, bombDamageMult, {
            speed: ENEMY_PROJECTILE_SPEED * 0.6,
            scaleMult: bombBurstCount >= 3 ? 1.86 : 1.66,
            tint: 0xff9a54,
            alpha: 0.98,
            isPlaneBomb: true,
            blastRadius: bombBlastRadius,
          });
        }
        enemy.setData('planeLastBombAt', this.time.now);
      }
      return true;
    }

    this.spawnEnemyProjectile(enemy, baseAngle, 1);
    return true;
  },

  spawnEnemyProjectile: function (enemy, angle, damageFactor = 1, options = null) {
    const projectileOptions = options || {};
    const spawnX = Number.isFinite(projectileOptions.spawnX) ? projectileOptions.spawnX : enemy.x;
    const spawnY = Number.isFinite(projectileOptions.spawnY) ? projectileOptions.spawnY : enemy.y;
    const isSoldierProjectile = !!enemy.getData('isSoldier');
    const useAnimatedSoldierProjectile = isSoldierProjectile && !projectileOptions.isGrenade;
    const soldierBulletYOffset = isSoldierProjectile && !Number.isFinite(projectileOptions.spawnY) ? sy(4.8) : 0;
    const projectileSpawnY = spawnY + soldierBulletYOffset;
    const projectileKey = projectileOptions.textureKey
      || (useAnimatedSoldierProjectile ? 'soldierProjectileGoldSheet' : 'enemyProjectile');
    const projectile = this.enemyProjectiles.create(spawnX, projectileSpawnY, projectileKey, 0);
    enemy.setData('lastAttackAt', this.time.now || 0);
    projectile.setData('sourceEnemy', enemy);
    projectile.setDepth(3.1);
    if (enemy.getData('isEliteSoldier')) {
      projectile.setScale(1.35 * GAMEPLAY_VISUAL_SCALE);
      if (!useAnimatedSoldierProjectile) {
        projectile.setTint(0xffd27a);
      }
    } else if (enemy.getData('isPlane')) {
      projectile.setScale(1.1 * GAMEPLAY_VISUAL_SCALE);
      projectile.setTint(0xbfefff);
    } else if (enemy.getData('enemyType') === 'tank') {
      projectile.setScale(1.16 * GAMEPLAY_VISUAL_SCALE);
      projectile.setTint(0xffb178);
    } else {
      projectile.setScale(1.05 * GAMEPLAY_VISUAL_SCALE);
    }
    if (projectileOptions.scaleMult) {
      projectile.setScale((projectile.scaleX || 1) * projectileOptions.scaleMult, (projectile.scaleY || 1) * projectileOptions.scaleMult);
    }
    if (projectileOptions.tint) {
      projectile.setTint(projectileOptions.tint);
    }
    if (typeof projectileOptions.alpha === 'number') {
      projectile.setAlpha(projectileOptions.alpha);
    }

    // Soldier bullet projectiles are invisible — damage only, no visual
    if (isSoldierProjectile && !projectileOptions.isGrenade) {
      projectile.setAlpha(0);
    }

    if (isSoldierProjectile && projectileOptions.isGrenade) {
      projectile.setAlpha(typeof projectileOptions.alpha === 'number' ? projectileOptions.alpha : 0.96);
    }

    let resolvedDamage = (enemy.getData('attackDamage') || 1) * damageFactor;
    if (isSoldierProjectile && !projectileOptions.isGrenade) {
      const minSoldierDamage = enemy.getData('isEliteSoldier') ? 0.32 : 0.2;
      resolvedDamage = Math.max(minSoldierDamage, resolvedDamage);
    }
    projectile.setData('damage', resolvedDamage);
    projectile.setData('isGrenade', !!projectileOptions.isGrenade);
    projectile.setData('targetTower', projectileOptions.targetTower || null);
    projectile.setData('explosionFrames', projectileOptions.explosionFrames || null);
    projectile.setData('explosionScale', projectileOptions.explosionScale || null);
    projectile.setData('explosionFlashRadius', projectileOptions.explosionFlashRadius || null);
    projectile.setData('explosionFlashColor', projectileOptions.explosionFlashColor || null);
    projectile.setData('isPlaneBomb', !!projectileOptions.isPlaneBomb);
    projectile.setData('blastRadius', Number(projectileOptions.blastRadius) || 0);
    projectile.setAngle(angle);
    // Keep projectile origin exact to computed muzzle point (no forward nudge)
    // so the tracer appears to exit from the visible barrel tip.
    let projectileSpeed = projectileOptions.speed || ENEMY_PROJECTILE_SPEED;
    if (isSoldierProjectile) {
      projectileSpeed *= enemy.getData('isEliteSoldier') ? 4.3 : 4.0;
      if (!projectileOptions.isGrenade) {
        const ttlMs = enemy.getData('isEliteSoldier') ? 520 : 460;
        this.time.delayedCall(ttlMs, () => {
          if (projectile?.active) {
            projectile.destroy();
          }
        });
      }
    }
    this.physics.velocityFromAngle(angle, projectileSpeed, projectile.body.velocity);

    // Apply gravity to grenades so they arc through the air
    if (projectileOptions.isGrenade && projectile.body) {
      projectile.body.setGravityY(320);
      // Spin the grenade sprite as it arcs through the air
      this.tweens.add({
        targets: projectile,
        angle: projectile.angle + 720,
        duration: 900,
        ease: 'Linear',
        repeat: -1,
      });
    }
  },

  animateSoldierMuzzleFire: function (enemy, angleDeg, originX, originY) {
    if (!enemy?.active || !enemy.getData('isSoldier')) {
      return;
    }

    const isElite = !!enemy.getData('isEliteSoldier');
    const angleRad = Phaser.Math.DegToRad(angleDeg);
    const fx = Number.isFinite(originX) ? originX : enemy.x;
    const fy = Number.isFinite(originY) ? originY : enemy.y;
    const clusterYOffset = sy(5.5);
    const coneLength = isElite ? sx(17) : sx(14);
    const coneHalfWidth = isElite ? sy(4.2) : sy(3.2);
    const flashColor = isElite ? 0xffdf96 : 0xffd4b2;
    const ringColor = isElite ? 0xfff2ca : 0xffefe0;

    const cone = this.add.triangle(
      fx + (Math.cos(angleRad) * sx(1.6)),
      fy + (Math.sin(angleRad) * sy(1.6)) + clusterYOffset,
      0,
      0,
      coneLength,
      -coneHalfWidth,
      coneLength,
      coneHalfWidth,
      flashColor,
      0.94,
    )
      .setDepth(3.66)
      .setRotation(angleRad);

    const ring = this.add.circle(fx, fy + clusterYOffset, isElite ? sx(5.6) : sx(4.9), ringColor, 0.34)
      .setDepth(3.65)
      .setBlendMode(Phaser.BlendModes.ADD);

    const smokeYOffset = sy(30);
    const smoke = this.add.circle(
      fx,
      fy + smokeYOffset + sy(4) + clusterYOffset,
      isElite ? sx(4.4) : sx(3.8),
      0x313845,
      0.3,
    )
      .setDepth(3.64);

    this.tweens.add({
      targets: cone,
      alpha: 0,
      scaleX: 1.45,
      scaleY: 1.18,
      duration: 82,
      ease: 'Cubic.Out',
      onComplete: () => cone.destroy(),
    });

    this.tweens.add({
      targets: ring,
      alpha: 0,
      scale: 1.72,
      duration: 96,
      ease: 'Quad.Out',
      onComplete: () => ring.destroy(),
    });

    this.tweens.add({
      targets: smoke,
      alpha: 0,
      scale: 1.4,
      y: smoke.y,
      duration: 130,
      ease: 'Sine.Out',
      onComplete: () => smoke.destroy(),
    });
  },

  getSoldierPose8BarrelTipCalibration: function () {
    if (this._soldierPose8BarrelTipCalibration) {
      return this._soldierPose8BarrelTipCalibration;
    }

    try {
      const sampleFrame = this.textures.getFrame('soldierShotCp2Sheet', 2);
      if (!sampleFrame) {
        return null;
      }

      const sourceImage = sampleFrame.source?.image;
      if (!sourceImage) {
        return null;
      }

      const fw = sampleFrame.cutWidth || sampleFrame.width || 128;
      const fh = sampleFrame.cutHeight || sampleFrame.height || 128;
      const canvas = document.createElement('canvas');
      canvas.width = fw;
      canvas.height = fh;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) {
        return null;
      }

      const perFrame = {};
      const perFrameSamples = {};
      let fallbackTip = null;

      for (let frameNumber = 0; frameNumber <= 3; frameNumber += 1) {
        const frame = this.textures.getFrame('soldierShotCp2Sheet', frameNumber);
        if (!frame) {
          continue;
        }

        // Analyze on black to isolate the red barrel guide lines from the sprite frame.
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, fw, fh);
        ctx.drawImage(sourceImage, frame.cutX, frame.cutY, fw, fh, 0, 0, fw, fh);
        const pixels = ctx.getImageData(0, 0, fw, fh).data;

        const redPoints = [];
        const flashPoints = [];
        for (let y = 0; y < fh; y += 1) {
          for (let x = 0; x < fw; x += 1) {
            const idx = ((y * fw) + x) * 4;
            const r = pixels[idx];
            const g = pixels[idx + 1];
            const b = pixels[idx + 2];
            const a = pixels[idx + 3];
            if (a < 20) {
              continue;
            }
            const isBarrelRed = r > 95
              && g < 190
              && b < 120
              && r > (b + 20)
              && x >= Math.floor(fw * 0.46);
            const isMuzzleFlash = r > 170
              && g > 80
              && g < 230
              && b < 140
              && x >= Math.floor(fw * 0.48)
              && y >= Math.floor(fh * 0.24)
              && y <= Math.floor(fh * 0.72);
            if (isMuzzleFlash) {
              flashPoints.push({ x, y });
            }
            if (!isBarrelRed) {
              continue;
            }

            // Broad prefilter for red barrel guide lines before front-cluster extraction.
            if (x >= Math.floor(fw * 0.42) && y >= Math.floor(fh * 0.22) && y <= Math.floor(fh * 0.82)) {
              redPoints.push({ x, y });
            }
          }
        }

        if (flashPoints.length > 0) {
          let minX = fw;
          for (let i = 0; i < flashPoints.length; i += 1) {
            if (flashPoints[i].x < minX) {
              minX = flashPoints[i].x;
            }
          }

          const flashYHistogram = new Map();
          for (let i = 0; i < flashPoints.length; i += 1) {
            const y = flashPoints[i].y;
            flashYHistogram.set(y, (flashYHistogram.get(y) || 0) + 1);
          }
          let flashModalY = Math.floor(fh * 0.5);
          let flashModalCount = -1;
          flashYHistogram.forEach((count, y) => {
            if (count > flashModalCount) {
              flashModalCount = count;
              flashModalY = Number(y);
            }
          });

          const rootBand = flashPoints.filter((p) => p.x <= (minX + 2) && Math.abs(p.y - flashModalY) <= 6);
          let minRootY = Number.POSITIVE_INFINITY;
          let maxRootY = Number.NEGATIVE_INFINITY;
          for (let i = 0; i < rootBand.length; i += 1) {
            const y = rootBand[i].y;
            if (y < minRootY) {
              minRootY = y;
            }
            if (y > maxRootY) {
              maxRootY = y;
            }
          }
          const rootY = rootBand.length > 0
            ? ((minRootY + maxRootY) * 0.5)
            : flashModalY;

          const tip = {
            pixelX: Math.max(0, minX - 1),
            pixelY: rootY,
          };
          const samples = flashPoints.filter((p) => p.x <= (minX + 8) && Math.abs(p.y - rootY) <= 8);

          perFrame[frameNumber] = tip;
          perFrameSamples[frameNumber] = samples.map((p) => ({ pixelX: p.x, pixelY: p.y }));
          fallbackTip = tip;
        } else if (redPoints.length > 0) {
          let maxX = -1;
          for (let i = 0; i < redPoints.length; i += 1) {
            if (redPoints[i].x > maxX) {
              maxX = redPoints[i].x;
            }
          }

          const frontBandMinX = Math.max(0, maxX - 18);
          const frontPoints = redPoints.filter((p) => p.x >= frontBandMinX);
          const yHistogram = new Map();
          for (let i = 0; i < frontPoints.length; i += 1) {
            const y = frontPoints[i].y;
            yHistogram.set(y, (yHistogram.get(y) || 0) + 1);
          }

          let modalY = Math.floor(fh * 0.5);
          let modalCount = -1;
          yHistogram.forEach((count, y) => {
            if (count > modalCount) {
              modalCount = count;
              modalY = Number(y);
            }
          });

          const yBand = 5;
          const frontCluster = frontPoints.filter((p) => Math.abs(p.y - modalY) <= yBand);
          const tipSource = frontCluster.length > 0 ? frontCluster : frontPoints;

          let tipPixelX = maxX;
          let tipMinY = Number.POSITIVE_INFINITY;
          let tipMaxY = Number.NEGATIVE_INFINITY;
          for (let i = 0; i < tipSource.length; i += 1) {
            const p = tipSource[i];
            if (p.x > tipPixelX) {
              tipPixelX = p.x;
              tipMinY = p.y;
              tipMaxY = p.y;
            } else if (p.x === tipPixelX) {
              if (p.y < tipMinY) {
                tipMinY = p.y;
              }
              if (p.y > tipMaxY) {
                tipMaxY = p.y;
              }
            }
          }

          const tipPixelY = Number.isFinite(tipMinY) && Number.isFinite(tipMaxY)
            ? ((tipMinY + tipMaxY) * 0.5)
            : modalY;
          const sampleBand = redPoints.filter((p) => p.x >= Math.floor(fw * 0.52) && Math.abs(p.y - tipPixelY) <= 8);
          const samples = sampleBand.length > 0 ? sampleBand : tipSource;

          const tip = {
            pixelX: tipPixelX,
            pixelY: tipPixelY,
          };
          perFrame[frameNumber] = tip;
          perFrameSamples[frameNumber] = samples.map((p) => ({ pixelX: p.x, pixelY: p.y }));
          fallbackTip = tip;
        }
      }

      if (!fallbackTip) {
        return null;
      }

      this._soldierPose8BarrelTipCalibration = {
        frameWidth: fw,
        frameHeight: fh,
        perFrame,
        perFrameSamples,
        fallback: fallbackTip,
      };
      return this._soldierPose8BarrelTipCalibration;
    } catch (_err) {
      return null;
    }
  },

  getSoldierMuzzleWorldPosition: function (enemy, options = null) {
    if (!enemy?.active || !enemy.getData('isSoldier')) {
      return { x: enemy?.x || 0, y: enemy?.y || 0 };
    }

    const opts = options || {};
    const style = enemy.getData('soldierSpriteStyle') || 'cp1';
    const facingLeft = typeof opts.facingLeft === 'boolean' ? opts.facingLeft : !!enemy.flipX;
    const animKey = enemy.anims?.currentAnim?.key || '';
    const inferredPhase = animKey.includes('Grenade')
      ? 'grenade'
      : animKey.includes('Fire')
        ? 'fire'
        : animKey.includes('Cock')
          ? 'cock'
          : 'run';
    const phase = opts.phaseHint || inferredPhase;

    const profileByStyle = {
      cp1: {
        run: { anchorX: sx(15), anchorY: -sy(8), barrelLength: sx(13) },
        cock: { anchorX: sx(16), anchorY: -sy(10), barrelLength: sx(15) },
        fire: { anchorX: sx(17), anchorY: -sy(12), barrelLength: sx(16.5) },
        grenade: { anchorX: sx(16), anchorY: -sy(11), barrelLength: sx(15.5) },
      },
      cp2: {
        run: { anchorX: sx(15.5), anchorY: -sy(8.5), barrelLength: sx(13.5) },
        cock: { anchorX: sx(16.6), anchorY: -sy(10.5), barrelLength: sx(15.2) },
        fire: { anchorX: sx(17.8), anchorY: -sy(12.2), barrelLength: sx(16.8) },
        grenade: { anchorX: sx(16.9), anchorY: -sy(11.1), barrelLength: sx(15.7) },
      },
      cp3: {
        run: { anchorX: sx(16), anchorY: -sy(8), barrelLength: sx(13.2) },
        cock: { anchorX: sx(17), anchorY: -sy(10), barrelLength: sx(15.3) },
        fire: { anchorX: sx(18), anchorY: -sy(12), barrelLength: sx(16.9) },
        grenade: { anchorX: sx(17.1), anchorY: -sy(11), barrelLength: sx(15.8) },
      },
    };
    const styleProfile = profileByStyle[style] || profileByStyle.cp1;
    const profile = styleProfile[phase] || styleProfile.run;

    const verticalShotDirection = enemy.getData('soldierVerticalShotDirection') || null;
    if ((phase === 'fire' || enemy.getData('soldierFirePoseLocked')) && verticalShotDirection) {
      const verticalAnchorX = enemy.x + (facingLeft ? -sx(16) : sx(16));
      const verticalAnchorY = enemy.y + (verticalShotDirection === 'up' ? -sy(12) : -sy(8));
      return {
        x: verticalAnchorX,
        y: verticalAnchorY + (verticalShotDirection === 'up' ? -sy(4) : sy(3)),
      };
    }

    // Pose-8 fire lock uses a single static aiming sprite. Lock to a hand-tuned
    // barrel-tip pixel anchor so muzzle flash and projectile start at the exact tip.
    if ((enemy.getData('soldierFirePoseMode') === '8')
      && (phase === 'fire' || enemy.getData('soldierFirePoseLocked'))) {
      const calibration = this.getSoldierPose8BarrelTipCalibration();
      if (calibration) {
        const lockedFrameNumber = Number(enemy.getData('soldierPose8LockedTextureFrame'));
        const frameNumber = Number.isFinite(lockedFrameNumber)
          ? lockedFrameNumber
          : Number(enemy.anims?.currentFrame?.textureFrame);
        const frameIndex = Number(enemy.anims?.currentFrame?.index || 1);
        const frameCount = Number(enemy.anims?.currentAnim?.frames?.length || 1);
        const shotAngleDeg = Number.isFinite(opts.angleDeg)
          ? opts.angleDeg
          : this.getSoldierBarrelAimAngle(enemy, 'fire', facingLeft, frameIndex, frameCount);
        const shotAngleRad = Phaser.Math.DegToRad(shotAngleDeg);
        const dirX = Math.cos(shotAngleRad);
        const dirY = Math.sin(shotAngleRad);
        const frameWidth = Number(calibration.frameWidth || 0) || 128;
        const displayOriginX = Number.isFinite(enemy.displayOriginX) ? enemy.displayOriginX : (frameWidth * 0.5);
        const displayOriginY = Number.isFinite(enemy.displayOriginY)
          ? enemy.displayOriginY
          : (Number(calibration.frameHeight || 0) || 128) * 0.5;

        const baseTip = calibration.perFrame?.[frameNumber] || calibration.fallback;
        let tip = baseTip;
        const candidates = calibration.perFrameSamples?.[frameNumber] || null;
        if (Array.isArray(candidates) && candidates.length > 0) {
          let bestScore = Number.NEGATIVE_INFINITY;
          let bestPoint = null;
          const baseLocalX = (facingLeft
            ? (frameWidth - Number(baseTip?.pixelX || 0))
            : Number(baseTip?.pixelX || 0)) - displayOriginX;
          const baseLocalY = Number(baseTip?.pixelY || 0) - displayOriginY;
          const maxYDelta = 5;
          const maxBackwardDelta = 14;
          for (let i = 0; i < candidates.length; i += 1) {
            const p = candidates[i];
            const lx = (facingLeft ? (frameWidth - p.pixelX) : p.pixelX) - displayOriginX;
            const ly = p.pixelY - displayOriginY;

            // Keep dynamic picks near the calibrated barrel line so shots cannot jump above the head.
            if (Math.abs(ly - baseLocalY) > maxYDelta) {
              continue;
            }
            if (lx < (baseLocalX - maxBackwardDelta)) {
              continue;
            }

            const score = (lx * dirX) + (ly * dirY);
            if (score > bestScore) {
              bestScore = score;
              bestPoint = { localX: lx, localY: ly };
            }
          }
          if (bestPoint) {
            tip = bestPoint;
          } else {
            tip = { localX: baseLocalX, localY: baseLocalY };
          }
        } else {
          tip = {
            localX: (facingLeft ? (frameWidth - Number(tip?.pixelX || 0)) : Number(tip?.pixelX || 0)) - displayOriginX,
            localY: Number(tip?.pixelY || 0) - displayOriginY,
          };
        }

        const scaleX = Math.abs(Number(enemy.scaleX || 1));
        const scaleY = Math.abs(Number(enemy.scaleY || enemy.scaleX || 1));
        const tipLocalX = Number(tip?.localX || 0) * scaleX;
        const tipLocalY = Number(tip?.localY || 0) * scaleY;
        return {
          x: enemy.x + tipLocalX,
          y: enemy.y + tipLocalY,
        };
      }

      const tipX = enemy.x + (facingLeft ? -sx(21.5) : sx(21.5));
      const tipY = enemy.y - sy(3.5);
      return { x: tipX, y: tipY };
    }

    const frameIndex = Number(enemy.anims?.currentFrame?.index || 1);
    const frameCount = Number(enemy.anims?.currentAnim?.frames?.length || 1);
    const angleDeg = Number.isFinite(opts.angleDeg)
      ? opts.angleDeg
      : this.getSoldierBarrelAimAngle(enemy, phase, facingLeft, frameIndex, frameCount);
    const angleRad = Phaser.Math.DegToRad(angleDeg);
    const anchorX = enemy.x + (facingLeft ? -profile.anchorX : profile.anchorX);
    const anchorY = enemy.y + profile.anchorY;
    const muzzleX = anchorX + (Math.cos(angleRad) * profile.barrelLength);
    const muzzleY = anchorY + (Math.sin(angleRad) * profile.barrelLength);

    return { x: muzzleX, y: muzzleY };
  },

  getSoldierBarrelAimAngle: function (enemy, phaseHint = 'fire', forcedFacingLeft = null, frameIndex = null, frameCount = null) {
    if (!enemy?.active || !enemy.getData('isSoldier')) {
      return 0;
    }

    const style = enemy.getData('soldierSpriteStyle') || 'cp1';
    const phasePitchByStyle = {
      cp1: { run: -4, cock: -6, fire: -8, grenade: -10 },
      cp2: { run: -3, cock: -5, fire: -7, grenade: -9 },
      cp3: { run: -4, cock: -6, fire: -8, grenade: -10 },
    };
    const fireFramePitchByStyle = {
      cp1: [-5, -6, -8, -10, -9, -8, -7, -6],
      cp2: [-4, -5, -7, -9, -8, -7, -6, -5],
      cp3: [-5, -6, -8, -10, -9, -8, -7, -6],
    };
    const stylePitch = phasePitchByStyle[style] || phasePitchByStyle.cp1;
    const phase = stylePitch[phaseHint] !== undefined ? phaseHint : 'fire';
    let pitch = stylePitch[phase];

    if (phase === 'fire' && Number.isFinite(frameIndex) && Number.isFinite(frameCount) && frameCount > 0) {
      const frameCurve = fireFramePitchByStyle[style] || fireFramePitchByStyle.cp1;
      const normalized = Phaser.Math.Clamp((frameIndex - 1) / Math.max(1, frameCount - 1), 0, 1);
      const curveIndex = Math.round(normalized * (frameCurve.length - 1));
      pitch = frameCurve[Math.max(0, Math.min(frameCurve.length - 1, curveIndex))];
    }

    const facingLeft = typeof forcedFacingLeft === 'boolean' ? forcedFacingLeft : !!enemy.flipX;
    if (facingLeft) {
      return 180 - pitch;
    }
    return pitch;
  },

  getSoldierVerticalFireAnimKey: function (enemy, towerTarget = null) {
    if (!enemy?.active || !enemy.getData('isSoldier') || !towerTarget) {
      return null;
    }

    const style = enemy.getData('soldierSpriteStyle') || 'cp1';
    if (style !== 'cp1') {
      enemy.setData('soldierVerticalShotDirection', null);
      return null;
    }

    const aimPoint = this.getSoldierMuzzleWorldPosition(enemy, {
      phaseHint: 'fire',
      facingLeft: !!enemy.getData('soldierAimLockedFlip'),
    });
    const deltaY = towerTarget.y - aimPoint.y;
    const deltaX = Math.abs(towerTarget.x - aimPoint.x);
    const aimAngle = Phaser.Math.RadToDeg(
      Phaser.Math.Angle.Between(aimPoint.x, aimPoint.y, towerTarget.x, towerTarget.y),
    );
    const verticalDeltaDeg = Math.abs(Math.abs(Phaser.Math.Angle.WrapDegrees(aimAngle)) - 90);
    const useVerticalPose = Math.abs(deltaY) >= sy(18)
      && verticalDeltaDeg <= 16
      && Math.abs(deltaY) > Math.max(sy(20), deltaX * 1.35);
    if (!useVerticalPose) {
      enemy.setData('soldierVerticalShotDirection', null);
      return null;
    }

    const direction = deltaY < 0 ? 'up' : 'down';
    enemy.setData('soldierVerticalShotDirection', direction);
    return direction === 'up'
      ? 'soldierFireVerticalUpCp1'
      : 'soldierFireVerticalDownCp1';
  },

  playPlaneTierSfx: function (enemy, options = null) {
    return false;
  },

  triggerSoldierFirePose: function (enemy, onShoot = null) {
    if (!enemy?.active || enemy.getData('isTestDummy')) {
      return false;
    }

    if (enemy.getData('soldierAttackSequenceActive')) {
      return false;
    }

    const now = this.time.now;
    const firePoseMode = enemy.getData('soldierFirePoseMode') || 'default';
    const singlePoseOnly = firePoseMode === '8';
    const attackAnim = enemy.getData('soldierAttackAnim') || 'soldierFireCp1';
    const cockAnim = enemy.getData('soldierCockAnim') || attackAnim;
    const shootAnim = attackAnim;
    const runAnim = enemy.getData('soldierRunAnim') || 'soldierRunCp1';
    const animDurationMs = (animKey, fallbackMs) => {
      const anim = this.anims.get(animKey);
      if (!anim) {
        return fallbackMs;
      }
      const frameCount = Math.max(1, anim.frames?.length || 1);
      const fps = Math.max(1, anim.frameRate || 12);
      return Math.max(90, Math.round((frameCount / fps) * 1000));
    };
    const cockMs = 0;
    const shootMs = this.anims.exists(shootAnim) ? animDurationMs(shootAnim, 130) : 0;
    const shootStartAtMs = 0;
    const shootImpactDelayMs = Math.max(42, Math.round(shootMs * 0.62));
    const recoilRecoverMs = singlePoseOnly
      ? Math.max(90, Number(enemy.getData('soldierRecoilRecoverMs') || 120))
      : 0;
    const totalMs = singlePoseOnly
      ? Math.max(170, shootMs + recoilRecoverMs)
      : Math.max(90, shootMs + 8);
    const hardLockPose8 = () => {
      if (!enemy.active || enemy.getData('isDying')) {
        return;
      }
      const pose8Key = shootAnim;
      if (!this.anims.exists(pose8Key)) {
        return;
      }

      enemy.play(pose8Key, false);
      const pose8Anim = this.anims.get(pose8Key);
      const targetFrameIndex = 0;
      const targetAnimFrame = pose8Anim?.frames?.[targetFrameIndex] || pose8Anim?.frames?.[0] || null;
      if (targetAnimFrame && typeof enemy.anims.setCurrentFrame === 'function') {
        enemy.anims.setCurrentFrame(targetAnimFrame);
        enemy.setData('soldierPose8LockedTextureFrame', Number(targetAnimFrame.textureFrame));
      }
      enemy.anims.pause();
      enemy.setData('soldierFirePoseLocked', true);
    };

    enemy.setData('soldierAttackSequenceActive', true);
    const nonSinglePoseWindowMs = Math.max(100, Math.round(shootMs + 20));
    const forcePoseWindowMs = singlePoseOnly ? (totalMs + 16) : nonSinglePoseWindowMs;
    enemy.setData('soldierForcePoseUntil', now + forcePoseWindowMs);
    // Never shorten an existing hold with a shorter one
    const existingHold = enemy.getData('soldierHoldPositionUntil') || 0;
    enemy.setData('soldierHoldPositionUntil', Math.max(existingHold, now + forcePoseWindowMs));

    // Single-motion fire: skip separate cock phase and go straight into shoot.
    this.setSoldierEmote(enemy, 'FIRE', 360);

    const gun = enemy.getData('soldierGun');
    if (gun?.active) {
      gun.setAlpha(1);
      gun.setTint(0xf2f7ff);
    }

    const finishAttackSequence = () => {
      if (!enemy.active) {
        return;
      }

      enemy.setData('soldierAttackSequenceActive', false);
      enemy.setData('soldierForcePoseUntil', 0);
      enemy.setData('soldierAimLockUntil', 0);
      const keepPose8Locked = singlePoseOnly
        && ((enemy.getData('soldierTargetLockedUntil') || 0) > (this.time.now || now));

      if (keepPose8Locked) {
        hardLockPose8();
      } else {
        if (enemy.getData('soldierFirePoseLocked')) {
          enemy.anims.resume();
          enemy.setData('soldierFirePoseLocked', false);
          enemy.setData('soldierPose8LockedTextureFrame', null);
        }
        enemy.setAngle(0);
        const nowTs = this.time.now || now;
        const shouldKeepHoldPose = ((enemy.getData('soldierTargetLockedUntil') || 0) > nowTs)
          || !!enemy.getData('soldierAttackTarget')
          || !!enemy.getData('soldierShouldStandStill');
        if (!shouldKeepHoldPose && this.anims.exists(runAnim)) {
          enemy.play(runAnim, true);
        } else {
          enemy.anims?.pause?.();
        }
      }

      if (gun?.active) {
        gun.clearTint();
      }
    };

    if (singlePoseOnly) {
      hardLockPose8();
      this.time.delayedCall(shootImpactDelayMs, () => {
        if (!enemy.active || enemy.getData('isDying')) {
          return;
        }
        if (typeof onShoot === 'function') {
          onShoot();
        }
      });

      this.time.delayedCall(totalMs, finishAttackSequence);
      return true;
    }

    this.time.delayedCall(shootStartAtMs, () => {
      if (!enemy.active || enemy.getData('isDying')) {
        return;
      }
      if (this.anims.exists(shootAnim)) {
        enemy.once(Phaser.Animations.Events.ANIMATION_COMPLETE, (anim) => {
          if (!enemy.active || enemy.getData('isDying')) {
            return;
          }
          if (anim?.key !== shootAnim) {
            return;
          }
          if (enemy.getData('soldierAttackSequenceActive')) {
            finishAttackSequence();
          }
        });
        enemy.play(shootAnim, false);
        if (singlePoseOnly) {
          hardLockPose8();
        }
      }
      this.time.delayedCall(shootImpactDelayMs, () => {
        if (!enemy.active || enemy.getData('isDying')) {
          return;
        }
        if (typeof onShoot === 'function') {
          onShoot();
        }
      });
    });

    this.time.delayedCall(
      singlePoseOnly ? totalMs : nonSinglePoseWindowMs,
      () => {
        if (enemy?.active && enemy.getData('soldierAttackSequenceActive')) {
          finishAttackSequence();
        }
      },
    );

    return true;
  },

  triggerSoldierGrenadePose: function (enemy) {
    if (!enemy?.active || enemy.getData('isTestDummy')) {
      return;
    }
    if (enemy.getData('soldierAttackSequenceActive') || enemy.getData('soldierFirePoseLocked')) {
      return;
    }

    const now = this.time.now || 0;
    const grenadeAnim = enemy.getData('soldierGrenadeAnim') || enemy.getData('soldierAttackAnim') || 'soldierFireCp1';
    const runAnim = enemy.getData('soldierRunAnim') || 'soldierRunCp1';
    const isPathTestGrenadier = !!enemy.getData('singleSoldierPathTest') && !!enemy.getData('soldierIsGrenadier');
    const grenadePoseHoldMs = isPathTestGrenadier ? 920 : 700;
    enemy.setData('soldierForcePoseUntil', now + grenadePoseHoldMs);
    const existingGrenadeHold = enemy.getData('soldierHoldPositionUntil') || 0;
    enemy.setData('soldierHoldPositionUntil', Math.max(existingGrenadeHold, now + grenadePoseHoldMs));

    if (this.anims.exists(grenadeAnim)) {
      enemy.play(grenadeAnim, false);
      // Chain recharge animation after throw completes
      const rechargeAnim = grenadeAnim.replace('Grenade', 'Recharge').replace('soldierGrenadeCp3', 'soldierRechargeCp3');
      if (this.anims.exists(rechargeAnim)) {
        enemy.once('animationcomplete-' + grenadeAnim, () => {
          if (enemy.active && !enemy.getData('isDying')) {
            enemy.play(rechargeAnim, false);
          }
        });
      }
      if (isPathTestGrenadier) {
        const grenadeCycle = enemy.anims?.currentAnim;
        const smokeFrame = grenadeCycle?.frames?.[6] || grenadeCycle?.frames?.[5] || grenadeCycle?.frames?.[0] || null;
        if (smokeFrame && typeof enemy.anims.setCurrentFrame === 'function') {
          enemy.anims.setCurrentFrame(smokeFrame);
        }
        enemy.anims.pause();
        enemy.setData('soldierFirePoseLocked', true);
      }
    }
    this.setSoldierEmote(enemy, 'GRN', 520);

    const gun = enemy.getData('soldierGun');
    if (gun?.active) {
      gun.setAlpha(0.98);
      gun.setTint(0xcdf8a6);
    }

    this.time.delayedCall(grenadePoseHoldMs, () => {
      if (!enemy.active || enemy.getData('isDying')) {
        return;
      }
      if (enemy.getData('soldierAttackSequenceActive') || enemy.getData('soldierFirePoseLocked')) {
        if (!isPathTestGrenadier) {
          return;
        }
      }

      enemy.setData('soldierForcePoseUntil', 0);
      if (enemy.getData('soldierFirePoseLocked')) {
        enemy.anims.resume();
        enemy.setData('soldierFirePoseLocked', false);
      }
      if (this.anims.exists(runAnim)) {
        enemy.play(runAnim, true);
      }

      if (gun?.active) {
        gun.clearTint();
      }
    });
  },

  updateSoldierDirection: function (enemy, ux, uy) {
    if (!enemy?.active) {
      return;
    }

    if (enemy.getData('soldierAttackSequenceActive')) {
      if (enemy.getData('soldierCanFlip')) {
        enemy.setFlipX(!!enemy.getData('soldierAimLockedFlip'));
      }
      return;
    }

    // Don't update direction while stopped to fire — keep last facing direction
    if (enemy.getData('soldierShouldStandStill')) {
      return;
    }

    const prevUx = enemy.getData('soldierMoveUx') ?? ux;
    const prevUy = enemy.getData('soldierMoveUy') ?? uy;
    const smoothUx = Phaser.Math.Linear(prevUx, ux, 0.22);
    const smoothUy = Phaser.Math.Linear(prevUy, uy, 0.22);
    enemy.setData('soldierMoveUx', smoothUx);
    enemy.setData('soldierMoveUy', smoothUy);

    let dir = 'east';
    if (Math.abs(smoothUx) >= Math.abs(smoothUy)) {
      dir = smoothUx >= 0 ? 'east' : 'west';
    } else {
      dir = smoothUy >= 0 ? 'south' : 'north';
    }

    enemy.setData('soldierDir', dir);
    if (enemy.getData('soldierCanFlip')) {
      const shouldFlipLeft = smoothUx < -0.18;
      const shouldFlipRight = smoothUx > 0.18;
      if (shouldFlipLeft) {
        enemy.setFlipX(true);
      } else if (shouldFlipRight) {
        enemy.setFlipX(false);
      }
    }

    if ((enemy.getData('soldierForcePoseUntil') || 0) > this.time.now) {
      return;
    }

    if ((enemy.getData('soldierTargetLockedUntil') || 0) > this.time.now) {
      return;
    }

    if (Math.abs(enemy.angle || 0) > 0.01) {
      enemy.setAngle(0);
    }

    const runAnim = enemy.getData('soldierRunAnim') || 'soldierRunCp1';
    if (!enemy.getData('soldierFirePoseLocked')
      && this.anims.exists(runAnim)
      && enemy.anims.currentAnim?.key !== runAnim) {
      enemy.play(runAnim, true);
    }
  },

  updateSoldierGunAttachment: function (enemy) {
    if (!enemy?.active) {
      return;
    }

    const gun = enemy.getData('soldierGun');
    if (!gun?.active) {
      return;
    }

    const isFacingLeft = !!enemy.flipX;
    const fallbackAimAngle = isFacingLeft ? 180 : 0;
    const hasAimLock = enemy.getData('soldierAttackSequenceActive')
      || enemy.getData('soldierFirePoseLocked')
      || ((enemy.getData('soldierAimLockUntil') || 0) > (this.time.now || 0));
    const lockedAim = Number(enemy.getData('soldierAimLockedAngle'));
    let gunAngle = hasAimLock && Number.isFinite(lockedAim)
      ? lockedAim
      : fallbackAimAngle;
    const config = {
      ox: isFacingLeft ? -sx(24) : sx(24),
      oy: sy(20),
      angle: gunAngle,
    };

    const target = enemy.getData('soldierAttackTarget');
    if (!hasAimLock && target?.active) {
      const pivotX = enemy.x + config.ox;
      const pivotY = enemy.y + config.oy;
      gunAngle = Phaser.Math.RadToDeg(
        Phaser.Math.Angle.Between(pivotX, pivotY, target.x, target.y),
      );
      config.angle = gunAngle;
    }

    gun.setPosition(enemy.x + config.ox, enemy.y + config.oy);
    gun.setAngle(config.angle);
  },

  computeSoldierSmartLaneOffset: function (enemy, worldX, worldY) {
    if (!enemy?.active) {
      return enemy?.getData('soldierLaneOffset') || 0;
    }

    // Soldiers should track the enemy route exactly.
    return 0;
  },

  setSoldierEmote: function (enemy, text = '', ttlMs = 420) {
    if (!enemy?.active || !enemy.getData('isSoldier')) {
      return;
    }
    const emoteNode = enemy.getData('soldierEmote');
    if (!emoteNode?.active) {
      return;
    }
    const value = String(text || '').trim();
    if (!value) {
      emoteNode.setVisible(false);
      enemy.setData('soldierEmoteUntil', 0);
      return;
    }
    emoteNode.setText(value);
    emoteNode.setVisible(true);
    enemy.setData('soldierEmoteUntil', (this.time.now || 0) + Math.max(120, Number(ttlMs) || 420));
  },

  updateSoldierEmotion: function (enemy) {
    if (!enemy?.active || !enemy.getData('isSoldier')) {
      return;
    }

    const emoteNode = enemy.getData('soldierEmote');
    if (!emoteNode?.active) {
      return;
    }

    emoteNode.setPosition(enemy.x, enemy.y - sy(88));
    const now = this.time.now || 0;
    const activeUntil = enemy.getData('soldierEmoteUntil') || 0;
    if (activeUntil > now) {
      return;
    }

    const health = Math.max(0, Number(enemy.getData('health') || 0));
    const maxHealth = Math.max(1, Number(enemy.getData('maxHealth') || 1));
    const ratio = health / maxHealth;
    if (ratio <= 0.33) {
      this.setSoldierEmote(enemy, 'OW', 460);
      return;
    }

    const dodgeUntil = enemy.getData('soldierDodgeUntil') || 0;
    if (dodgeUntil > now) {
      this.setSoldierEmote(enemy, '?!', 220);
      return;
    }

    emoteNode.setVisible(false);
  },

  triggerSoldierHurtPose: function (enemy) {
    if (!enemy?.active || !enemy.getData('isSoldier')) {
      return;
    }
    const now = this.time.now || 0;
    const nextHurtPoseAt = enemy.getData('soldierNextHurtPoseAt') || 0;
    if (now < nextHurtPoseAt) {
      return;
    }
    enemy.setData('soldierNextHurtPoseAt', now + 180);

    // Do not override cock/fire sequence with hurt spam from incoming tower shots.
    if (enemy.getData('soldierAttackSequenceActive') || enemy.getData('soldierFirePoseLocked')) {
      this.setSoldierEmote(enemy, 'OW', 220);
      return;
    }

    const hurtAnim = enemy.getData('soldierHurtAnim') || 'soldierHurtCp1';
    const runAnim = enemy.getData('soldierRunAnim') || 'soldierRunCp1';
    if (this.anims.exists(hurtAnim)) {
      enemy.play(hurtAnim, false);
      enemy.setData('soldierForcePoseUntil', now + 240);
      this.time.delayedCall(220, () => {
        if (!enemy.active || enemy.getData('isDying')) {
          return;
        }
        if (enemy.getData('soldierAttackSequenceActive') || enemy.getData('soldierFirePoseLocked')) {
          return;
        }
        enemy.setData('soldierForcePoseUntil', 0);
        if (!enemy.getData('soldierAttackSequenceActive') && this.anims.exists(runAnim)) {
          enemy.play(runAnim, true);
        }
      });
    }
    this.setSoldierEmote(enemy, 'OW', 340);
  },

  updateTankGunAttachment: function (enemy) {
    if (!enemy?.active) {
      return;
    }

    const tankGun = enemy.getData('tankGun');
    if (!tankGun?.active) {
      return;
    }

    tankGun.setPosition(enemy.x, enemy.y - sy(6));

    // Aim at closest active tower, fall back to hull direction when no towers exist.
    let closestTower = null;
    let closestDist = Infinity;
    this.towers?.children?.entries?.forEach((tower) => {
      if (!tower?.active) return;
      const tp = this.getTowerTargetPoint?.(tower) || tower;
      const d = Phaser.Math.Distance.Between(enemy.x, enemy.y, tp.x, tp.y);
      if (d < closestDist) { closestDist = d; closestTower = tower; }
    });

    if (closestTower?.active) {
      const tp = this.getTowerTargetPoint?.(closestTower) || closestTower;
      tankGun.setRotation(Phaser.Math.Angle.Between(enemy.x, enemy.y, tp.x, tp.y) + Math.PI / 2);
    } else {
      tankGun.setRotation(enemy.rotation || 0);
    }
  },

  updateHumveeGunAttachment: function (enemy) {
    if (!enemy?.active) {
      return;
    }

    const humveeGun = enemy.getData('humveeGun');
    if (!humveeGun?.active) {
      return;
    }

    humveeGun.setPosition(enemy.x, enemy.y);

    // Always aim at closest tower regardless of attack range
    let closestTower = null;
    let closestDistance = Infinity;

    this.towers.children.entries.forEach((tower) => {
      if (!tower.active) return;
      const towerPoint = this.getTowerTargetPoint(tower);
      if (!towerPoint) return;
      const dist = Phaser.Math.Distance.Between(enemy.x, enemy.y, towerPoint.x, towerPoint.y);
      if (dist < closestDistance) {
        closestTower = tower;
        closestDistance = dist;
      }
    });

    if (closestTower?.active) {
      const towerTarget = this.getTowerTargetPoint(closestTower);
      if (towerTarget) {
        // gsTurret3 faces north by default, so add π/2 to align barrel with aim angle
        humveeGun.setRotation(
          Phaser.Math.Angle.Between(enemy.x, enemy.y, towerTarget.x, towerTarget.y) + Math.PI / 2
        );
        return;
      }
    }

    // No towers — face forward
    humveeGun.setRotation((enemy.rotation || 0) + Math.PI / 2);
  },

  enemyProjectileHitTower: function (projectile, tower) {
    const designatedTarget = projectile?.getData?.('targetTower') || null;
    if (designatedTarget?.active && tower?.active && designatedTarget !== tower) {
      return;
    }

    const hitX = projectile?.x;
    const hitY = projectile?.y;
    const isGrenade = !!projectile?.getData?.('isGrenade');
    const isPlaneBomb = !!projectile?.getData?.('isPlaneBomb');
    const projectileDamage = Number(projectile?.getData?.('damage') || 1);
    const projectileBlastRadius = Number(projectile?.getData?.('blastRadius') || 0);
    const explosionFrames = projectile?.getData?.('explosionFrames');
    const explosionScale = projectile?.getData?.('explosionScale');
    const explosionFlashRadius = projectile?.getData?.('explosionFlashRadius');
    const explosionFlashColor = projectile?.getData?.('explosionFlashColor');
    projectile.destroy();

    const impactX = tower?.active && Number.isFinite(tower.x) ? tower.x : hitX;
    const impactY = tower?.active && Number.isFinite(tower.y) ? tower.y : hitY;

    if (isPlaneBomb && Number.isFinite(impactX) && Number.isFinite(impactY)) {
      const bombRadius = projectileBlastRadius > 0 ? projectileBlastRadius : sx(96);
      const bombFlash = this.add.circle(impactX, impactY, bombRadius * 0.62, 0xffa560, 0.34)
        .setDepth(9.32)
        .setBlendMode(Phaser.BlendModes.ADD);
      this.tweens.add({
        targets: bombFlash,
        alpha: 0,
        scaleX: 1.4,
        scaleY: 1.4,
        duration: 190,
        ease: 'Quad.Out',
        onComplete: () => {
          if (bombFlash?.active) {
            bombFlash.destroy();
          }
        },
      });
      this.playExplosionAnimation(impactX, impactY - sy(10), TANK_DEATH_EXPLOSION_FRAMES, {
        scale: 1.28,
        alpha: 0.92,
        depth: 9.31,
        frameDuration: 62,
        sfxRate: 0.92,
        sfxVolume: 0.9,
        flashRadius: bombRadius,
        flashColor: 0xff9650,
      });

      this.towers.children.entries.forEach((candidate) => {
        if (!candidate?.active) {
          return;
        }
        if (DEBUG_FLAGS.tower1InvincibleForTesting && candidate.getData('towerId') === 1) {
          return;
        }
        const dx = candidate.x - impactX;
        const dy = candidate.y - impactY;
        const dist = Math.hypot(dx, dy);
        if (dist > bombRadius) {
          return;
        }
        const falloff = Math.max(0.55, 1 - ((dist / bombRadius) * 0.45));
        const splashDamage = projectileDamage * falloff;
        const mitigatedSplash = this.calculateEnemyDamageToTower(candidate, splashDamage);
        const nextHealth = (candidate.getData('health') || 0) - mitigatedSplash;
        candidate.setData('health', nextHealth);
        candidate.setTint(0xff9d8b);
        this.time.delayedCall(100, () => {
          if (candidate.active) {
            candidate.clearTint();
          }
        });
        this.syncTowerHealthVisual(candidate);
        if (nextHealth <= 0) {
          this.destroyTower(candidate);
        }
      });
      return;
    }

    if (isGrenade && Number.isFinite(impactX) && Number.isFinite(impactY)) {
      const grenadeExplosionScale = Number.isFinite(explosionScale) ? explosionScale : 1.32;
      const grenadeVisualCenterLift = sy(26);
      const explosionSpriteY = impactY - grenadeVisualCenterLift;
      if (this.anims.exists('soldierGrenadeExplosionCp1')) {
        this.playExplosionSfx(1.08, 0.84);
        const coreFlash = this.add.circle(
          impactX,
          impactY,
          Number.isFinite(explosionFlashRadius) ? explosionFlashRadius : sx(34),
          Number.isFinite(explosionFlashColor) ? explosionFlashColor : 0xffa460,
          0.68,
        )
          .setDepth(9.24)
          .setBlendMode(Phaser.BlendModes.ADD);
        this.tweens.add({
          targets: coreFlash,
          alpha: 0,
          scaleX: 1.45,
          scaleY: 1.45,
          duration: 150,
          ease: 'Quad.easeOut',
          onComplete: () => {
            if (coreFlash?.active) {
              coreFlash.destroy();
            }
          },
        });

        const blast = this.add.sprite(impactX, impactY, 'soldierGrenadeExplosionCp1Sheet', 0)
          .setPosition(impactX, explosionSpriteY)
          .setScale(grenadeExplosionScale)
          .setDepth(9.25)
          .setAlpha(0.96);
        blast.play('soldierGrenadeExplosionCp1');
        blast.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
          if (blast?.active) {
            blast.destroy();
          }
        });
      } else {
        this.playExplosionAnimation(impactX, explosionSpriteY, Array.isArray(explosionFrames) ? explosionFrames : SOLDIER_DEATH_EXPLOSION_FRAMES, {
          scale: grenadeExplosionScale,
          alpha: 0.95,
          depth: 9.25,
          frameDuration: 74,
          sfxRate: 1.08,
          sfxVolume: 0.84,
          flashRadius: Number.isFinite(explosionFlashRadius) ? explosionFlashRadius : sx(34),
          flashColor: Number.isFinite(explosionFlashColor) ? explosionFlashColor : 0xffa460,
        });
      }
    }

    if (!tower?.active) {
      return;
    }

    if (DEBUG_FLAGS.tower1InvincibleForTesting && tower.getData('towerId') === 1) {
      tower.setData('health', Math.max(1, tower.getData('maxHealth') || TOWER_MAX_HEALTH));
      this.syncTowerHealthVisual(tower);
      return;
    }

    const mitigatedDamage = this.calculateEnemyDamageToTower(tower, projectileDamage);
    const health = (tower.getData('health') || 0) - mitigatedDamage;
    tower.setData('health', health);

    tower.setTint(0xff94b3);
    this.time.delayedCall(95, () => {
      if (tower.active) {
        tower.clearTint();
      }
    });
    this.syncTowerHealthVisual(tower);

    if (health > 0) {
      return;
    }

    this.destroyTower(tower, { rewardEnemyCommander: true });
    this.setStatus('A turret has been destroyed by enemy fire.', '#ff9bb5');
  },

  calculateEnemyDamageToTower: function (tower, rawDamage) {
    const towerArmor  = tower.getData('towerArmor')  || 0;
    const maxHealth   = tower.getData('maxHealth')   || TOWER_MAX_HEALTH;
    // Armor mitigation (min 25% damage)
    const mitigated = rawDamage * Math.max(0.25, 1 - (towerArmor * 0.28));
    // Hard cap: a single hit can never remove more than 16% of max HP.
    // This guarantees at least 7 hits to destroy any tower at any wave.
    return Math.min(mitigated, maxHealth * 0.16);
  },

  syncTowerHealthVisual: function (tower) {
    if (!tower || !tower.active) {
      return;
    }

    const health = Math.max(0, tower.getData('health') || 0);
    const maxHealth = Math.max(1, tower.getData('maxHealth') || TOWER_MAX_HEALTH);
    const healthRatio = health / maxHealth;
    const hpFill = tower.getData('hpFill');
    if (hpFill) {
      hpFill.width = Math.max(0, sx(42) * healthRatio);
      if (healthRatio > 0.65) {
        hpFill.fillColor = 0x7dffc2;
      } else if (healthRatio > 0.35) {
        hpFill.fillColor = 0xffd271;
      } else {
        hpFill.fillColor = 0xff7a92;
      }
    }
  },

  destroyTower: function (tower, options = {}) {
    if (!tower || !tower.active) {
      return;
    }

    const towerBase = tower.getData('towerBase');
    if (towerBase) {
      towerBase.occupied = false;
    }

    const idLabel = tower.getData('idLabel');
    const hpBg = tower.getData('hpBg');
    const hpFill = tower.getData('hpFill');
    const fireAnimSprite = tower.getData('fireAnimSprite');
    const towerFoundation = tower.getData('towerFoundation');
    const towerGroundShadow = tower.getData('towerGroundShadow');
    const fireAnimResetTimer = tower.getData('fireAnimResetTimer');
    const regenTimer = tower.getData('regenTimer');
    if (idLabel) {
      idLabel.destroy();
    }
    if (hpBg) {
      hpBg.destroy();
    }
    if (hpFill) {
      hpFill.destroy();
    }
    if (fireAnimResetTimer) {
      fireAnimResetTimer.remove(false);
    }
    if (regenTimer) {
      regenTimer.remove(false);
    }
    if (fireAnimSprite) {
      fireAnimSprite.destroy();
    }
    if (towerFoundation) {
      towerFoundation.destroy();
    }
    if (towerGroundShadow) {
      towerGroundShadow.destroy();
    }

    if (this.selectedPlacedTower === tower) {
      this.selectedPlacedTower = null;
      this.refreshSelectedPlacedTowerDetails();
    }

    if (options.rewardEnemyCommander && this.isMultiplayerEnemyCommanderRole?.()) {
      const runtime = this.multiplayerRuntime || null;
      if (runtime?.waveActive && !this.gameState?.prepPhase && !this.gameState?.gameOver) {
        const sourceDef = tower.getData('sourceTowerDef')
          || this.towerCatalog?.find((item) => item.id === tower.getData('towerId'))
          || null;
        const towerCost = Math.max(0, Number(sourceDef?.cost || BUILD_COST));
        const rewardThreat = Math.max(22, Math.round(towerCost * 0.55));
        runtime.threat = Math.min(runtime.threatMax || 0, (runtime.threat || 0) + rewardThreat);
        this.multiplayerRuntime = runtime;
        this.updateMultiplayerCommanderHud?.(true);
        this.setStatus('Enemy commander gained +' + rewardThreat + ' bounty from a destroyed turret.', '#ffd9a4');
      }
    }

    tower.destroy();
    this.updateTowerBaseIndicators();
  },

  updateTowerFire: function () {
    const now = this.time.now;

    this.towers.children.entries.forEach((tower) => {
      if (tower.getData('reloading')) {
        if (now >= tower.getData('reloadDoneAt')) {
          tower.setData('reloading', false);
          tower.setData('ammo', Math.max(1, tower.getData('magSize') - 1));
        }
        return;
      }

      const ammo = tower.getData('ammo');
      if (ammo <= 0) {
        tower.setData('reloading', true);
        tower.setData('reloadDoneAt', now + tower.getData('reloadTime'));
        return;
      }

      const lastFire = tower.getData('lastFire');
      const fireRate = tower.getData('fireRate');
      const range = tower.getData('range');

      if (now - lastFire <= fireRate) {
        return;
      }

      const closest = this.selectEnemyForTower(tower);

      if (!closest) {
        tower.setAngle(0);
        return;
      }

      tower.setRotation(Phaser.Math.Angle.Between(tower.x, tower.y, closest.x, closest.y) + Math.PI / 2);
      this.fireTowerWeapon(tower, closest);
      tower.setData('lastFire', now);
      tower.setData('ammo', ammo - 1);
    });
  },

  selectEnemyForTower: function (tower) {
    const range = tower.getData('range');
    const effectiveRange = range * 1.4;
    const preference = tower.getData('targetPreference') || 'progress';
    const now = this.time.now || 0;
    let bestEnemy = null;
    let bestScore = -Infinity;

    this.enemies.children.entries.forEach((enemy) => {
      if (!enemy.active) {
        return;
      }
      if (enemy.getData('isDying')) {
        return;
      }

      const distance = Phaser.Math.Distance.Between(tower.x, tower.y, enemy.x, enemy.y);
      const enemyEffectiveRange = enemy.getData('soldierIsGrenadier')
        ? (effectiveRange * 1.2)
        : effectiveRange;
      if (distance > enemyEffectiveRange) {
        return;
      }

      const score = this.scoreEnemyForTower(tower, enemy, preference, distance, now);
      if (score > bestScore) {
        bestScore = score;
        bestEnemy = enemy;
      }
    });

    return bestEnemy;
  },

  scoreEnemyForTower: function (tower, enemy, preference, distance, nowTs = 0) {
    const progress = this.getEnemyProgress(enemy);
    const currentSpeed = this.getEnemyCurrentSpeed(enemy);
    const armor = enemy.getData('armor') || 0;
    const healthRatio = (enemy.getData('health') || 1) / Math.max(1, enemy.getData('maxHealth') || 1);
    const cluster = this.countEnemiesNear(enemy, sx(64));
    const currentAttackTarget = enemy.getData('currentAttackTarget') || enemy.getData('soldierAttackTarget') || null;
    const isAttackingThisTower = !!(currentAttackTarget?.active && currentAttackTarget === tower);
    const isAttackingAnyTower = !!currentAttackTarget?.active;
    const recentShotAge = Math.max(0, nowTs - Number(enemy.getData('lastAttackAt') || 0));
    const shotRecencyWindow = 1200;
    const recencyWeight = Phaser.Math.Clamp(1 - (recentShotAge / shotRecencyWindow), 0, 1);
    const isGrenadier = !!enemy.getData('soldierIsGrenadier');
    const grenadeReadyAt = Number(enemy.getData('soldierGrenadeReadyAt') || 0);
    const grenadeReadySoon = isGrenadier && (grenadeReadyAt <= nowTs + 900);
    let threatBonus = 0;

    if (isAttackingThisTower) {
      threatBonus += 90000;
    } else if (isAttackingAnyTower) {
      threatBonus += 30000;
    }
    if (isGrenadier) {
      threatBonus += grenadeReadySoon ? 28000 : 16000;
    }
    if (recencyWeight > 0) {
      threatBonus += 18000 * recencyWeight;
    }

    if (preference === 'fast') {
      return (currentSpeed * 10) + progress - distance * 0.04 + threatBonus;
    }
    if (preference === 'heavy') {
      return (armor * 120) + ((enemy.getData('health') || 0) * 8) + progress + threatBonus;
    }
    if (preference === 'cluster') {
      return (cluster * 180) + progress - distance * 0.03 + threatBonus;
    }
    if (preference === 'weakened') {
      return ((1 - healthRatio) * 320) + progress + threatBonus;
    }
    if (preference === 'front') {
      return progress + ((tower.getData('range') - distance) * 0.15) + threatBonus;
    }

    return progress - distance * 0.02 + threatBonus;
  },

  getEnemyProgress: function (enemy) {
    const pathIndex = enemy.getData('pathIndex') || 0;
    const segmentDistance = enemy.getData('segmentDistance') || 0;
    return (pathIndex * 10000) + segmentDistance;
  },

  getEnemyCurrentSpeed: function (enemy) {
    const now = this.time.now;
    const slowUntil = enemy.getData('slowUntil') || 0;
    let slowFactor = enemy.getData('slowFactor') || 1;
    if (slowUntil <= now) {
      slowFactor = 1;
      enemy.setData('slowFactor', 1);
    }
    return (enemy.getData('speed') || ENEMY_BASE_SPEED) * slowFactor;
  },

  countEnemiesNear: function (originEnemy, radius) {
    let count = 0;
    this.enemies.children.entries.forEach((enemy) => {
      if (!enemy.active || enemy === originEnemy) {
        return;
      }
      const distance = Phaser.Math.Distance.Between(originEnemy.x, originEnemy.y, enemy.x, enemy.y);
      if (distance <= radius) {
        count += 1;
      }
    });
    return count;
  },

  getEnergyWeaponProfile: function (tower) {
    const towerId = tower.getData('towerId') || 0;
    if (towerId === 3) {
      return {
        beamColor: 0x74d8ff,
        beamGlow: 0xbdefff,
        pulseCore: 0x78e0ff,
        pulseRing: 0xd5f6ff,
        sfxFreq: 880,
        sfxType: 'triangle',
      };
    }
    if (towerId === 5) {
      return {
        beamColor: 0xffbf7a,
        beamGlow: 0xffe2b3,
        pulseCore: 0xffc67f,
        pulseRing: 0xffefcc,
        sfxFreq: 610,
        sfxType: 'sawtooth',
      };
    }
    if (towerId === 7) {
      return {
        beamColor: 0xff8cc4,
        beamGlow: 0xffd1e8,
        pulseCore: 0xff7fbc,
        pulseRing: 0xffd7ee,
        sfxFreq: 540,
        sfxType: 'square',
      };
    }
    if (towerId === 8) {
      return {
        beamColor: 0x9d8bff,
        beamGlow: 0xded7ff,
        pulseCore: 0x8ea4ff,
        pulseRing: 0xe4e8ff,
        sfxFreq: 700,
        sfxType: 'triangle',
      };
    }
    if (towerId === 14) {
      return {
        beamColor: 0x57ff9a,
        beamGlow: 0xbfffd8,
        pulseCore: 0x66ffab,
        pulseRing: 0xd6ffe8,
        sfxFreq: 930,
        sfxType: 'sawtooth',
      };
    }

    return {
      beamColor: 0x9fe7ff,
      beamGlow: 0xd9f7ff,
      pulseCore: 0x8ef0ff,
      pulseRing: 0xbef7ff,
      sfxFreq: 760,
      sfxType: 'triangle',
    };
  },

  playEnergyWeaponSfx: function (profile, durationMs = 70) {
    this.playShotSfx({
      audioType: profile.sfxType || 'triangle',
      audioFreq: profile.sfxFreq || 700,
      class: 'energy',
    }, durationMs, 0.05);
  },

  ensureAudioReady: function (forceResume = false) {
    if (!this.sound) {
      return false;
    }

    this.sound.setMute(false);
    this.sound.setVolume(1);

    const audioCtx = this.sound.context;
    if (audioCtx && (forceResume || audioCtx.state !== 'running')) {
      audioCtx.resume().catch(() => {
        // Browser/Electron may still require explicit user input timing.
      });
    }

    if (this.sound.locked && this.sound.unlock) {
      this.sound.unlock();
    }

    return !this.sound.locked;
  },

  playShotSfx: function (vfxProfile, durationMs = 70, peakGain = 0.045) {
    this.ensureAudioReady(false);

    const weaponBusVolume = this.getAudioBusLevel('weapon');
    if (weaponBusVolume <= 0.001) {
      return;
    }

    let playedBufferedSample = false;
    const shotSfxKey = vfxProfile?.shotSfxKey;
    if (shotSfxKey && this.cache?.audio?.exists(shotSfxKey)) {
      const cadenceRate = Phaser.Math.Clamp(88 / Math.max(42, durationMs), 0.9, 1.22);
      const playbackRate = Phaser.Math.Clamp((vfxProfile.shotSfxRate || 1) * cadenceRate * 0.94, 0.72, 1.32);
      const baseVolume = Phaser.Math.Clamp(vfxProfile.shotSfxVolume || 0.5, 0, 1);
      const volume = this.getConfiguredAudioVolume('weapon', baseVolume * 0.36);
      try {
        const pooledSnd = this.getPooledShot(shotSfxKey);
        let played = false;
        if (pooledSnd) {
          pooledSnd.setVolume(volume);
          pooledSnd.setRate(playbackRate);
          pooledSnd.play();
          played = true;
        } else {
          played = this.sound.play(shotSfxKey, { volume, rate: playbackRate });
        }
        if (played) {
          playedBufferedSample = true;
        }
      } catch (error) {
        // Fall back to synthesized beep below.
      }
    }

    const synthCadenceGateMs = 65;
    const nowMs = this.time?.now || 0;
    if (playedBufferedSample && (nowMs - (this.lastSynthShotAt || -9999) < synthCadenceGateMs)) {
      return;
    }
    this.lastSynthShotAt = nowMs;

    const audioCtx = this.sound?.context;
    if (!audioCtx) {
      return;
    }

    try {
      const now = audioCtx.currentTime;
      const gain = audioCtx.createGain();
      const lowpass = audioCtx.createBiquadFilter();
      const osc = audioCtx.createOscillator();
      const synthPeakGain = playedBufferedSample
        ? Phaser.Math.Clamp(peakGain * 0.22, 0.004, 0.014)
        : Phaser.Math.Clamp(peakGain * 0.5, 0.008, 0.032);
      const busAdjustedPeakGain = synthPeakGain * weaponBusVolume;

      osc.type = vfxProfile.audioType || 'triangle';
      const baseFreq = (vfxProfile.audioFreq || 700) * 0.9;
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.76, now + (durationMs / 1000));

      lowpass.type = 'lowpass';
      lowpass.frequency.setValueAtTime(2200, now);
      lowpass.Q.setValueAtTime(0.7, now);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(busAdjustedPeakGain, now + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + ((durationMs + 16) / 1000));

      osc.connect(lowpass);
      lowpass.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + ((durationMs + 16) / 1000));
    } catch (error) {
      // Keep gameplay safe if browser blocks audio context usage.
    }
  },

  playRocketImpactSfx: function (vfxProfile) {
    const explosionPlayed = this.playExplosionSfx(
      Phaser.Math.Clamp((vfxProfile?.shotSfxRate || 1) * 0.82, 0.68, 1.08),
      Phaser.Math.Clamp((vfxProfile?.shotSfxVolume || 0.72) * 0.82, 0.35, 0.9)
    );
    if (explosionPlayed) {
      return;
    }

    const rocketProfile = {
      ...vfxProfile,
      shotSfxRate: Phaser.Math.Clamp((vfxProfile?.shotSfxRate || 1) * 0.78, 0.65, 1.15),
      shotSfxVolume: Phaser.Math.Clamp((vfxProfile?.shotSfxVolume || 0.72) * 0.86, 0.4, 0.8),
      audioFreq: Math.max(180, (vfxProfile?.audioFreq || 320) * 0.62),
    };
    this.playShotSfx(rocketProfile, 96, 0.06);
  },

  playExplosionSfx: function (playbackRate = 1, volume = 1.0) {
    this.ensureAudioReady(false);
    if (this.getAudioBusLevel('explosion') <= 0.001) {
      return false;
    }
    const nowMs = this.time?.now || 0;
    if (nowMs - (this.lastExplosionSfxAt || -9999) < 160) {
      return false;
    }

    if (!this.cache?.audio?.exists('explosionSound')) {
      return false;
    }

    try {
      const adjustedVolume = this.getConfiguredAudioVolume('explosion', volume);
      const played = this.sound.play('explosionSound', {
        rate: Phaser.Math.Clamp(playbackRate, 0.65, 1.2),
        volume: Phaser.Math.Clamp(adjustedVolume, 0, 1),
      });
      if (played) {
        this.lastExplosionSfxAt = nowMs;
      }
      return !!played;
    } catch (error) {
      return false;
    }
  },

  playEliteDeathGroanSfx: function (playbackRate = 1, volume = 0.74) {
    this.ensureAudioReady(false);
    if (this.getAudioBusLevel('other') <= 0.001) {
      return false;
    }

    const nowMs = this.time?.now || 0;
    if (nowMs - (this.lastEliteDeathGroanAt || -9999) < 280) {
      return false;
    }

    if (!this.cache?.audio?.exists('eliteDeathGroanSound')) {
      return false;
    }

    try {
      const adjustedVolume = this.getConfiguredAudioVolume('other', volume);
      const played = this.sound.play('eliteDeathGroanSound', {
        rate: Phaser.Math.Clamp(playbackRate, 0.8, 1.15),
        volume: Phaser.Math.Clamp(adjustedVolume, 0, 1),
      });
      if (played) {
        this.lastEliteDeathGroanAt = nowMs;
      }
      return !!played;
    } catch (error) {
      return false;
    }
  },

  stopAllActiveGameAudio: function () {
    if (!this.sound?.sounds?.length) {
      return;
    }

    this.sound.sounds.forEach((snd) => {
      if (!snd?.isPlaying) {
        return;
      }
      try {
        snd.stop();
      } catch (_) {}
    });

    this.activeThemeMusicMode = 'none';
  },

  stopTankEngineLoop: function () {
    if (this.tankEngineLoop?.isPlaying) {
      this.tankEngineLoop.stop();
    }
  },

  syncTankEngineLoop: function () {
    if (!this.sound || !this.cache?.audio?.exists(TANK_ENGINE_AUDIO_KEY)) {
      return;
    }

    const hasMovingTank = !this.gameState?.prepPhase && this.enemies?.children?.entries?.some(
      (enemy) => enemy?.active
        && !enemy.getData('isDying')
        && !enemy.getData('isTestDummy')
        && enemy.getData('enemyType') === 'tank'
    );

    if (!hasMovingTank || this.getAudioBusLevel('other') <= 0.001) {
      this.stopTankEngineLoop();
      return;
    }

    this.ensureAudioReady(false);

    const targetVolume = Phaser.Math.Clamp(this.getConfiguredAudioVolume('other', 0.62), 0, 1);
    if (!this.tankEngineLoop) {
      this.tankEngineLoop = this.sound.add(TANK_ENGINE_AUDIO_KEY, {
        loop: true,
        volume: targetVolume,
      });
    }

    this.tankEngineLoop.setVolume(targetVolume);
    if (!this.tankEngineLoop.isPlaying) {
      this.tankEngineLoop.play({
        loop: true,
        volume: targetVolume,
      });
    }
  },

  playWaveWinSfx: function (playbackRate = 1, volume = 0.92) {
    this.ensureAudioReady(false);
    if (this.getAudioBusLevel('other') <= 0.001) {
      return false;
    }

    if (!this.cache?.audio?.exists('waveWinSound')) {
      return false;
    }

    try {
      const adjustedVolume = this.getConfiguredAudioVolume('other', volume);
      const boostedVolume = Phaser.Math.Clamp(adjustedVolume * 2.4, 0, 1);
      const played = this.sound.play('waveWinSound', {
        rate: Phaser.Math.Clamp(playbackRate, 0.8, 1.15),
        volume: boostedVolume,
      });
      return !!played;
    } catch (error) {
      return false;
    }
  },

  playGameOverSfx: function (playbackRate = 1, volume = 0.96) {
    this.ensureAudioReady(false);
    if (this.getAudioBusLevel('other') <= 0.001) {
      return false;
    }

    if (!this.cache?.audio?.exists(GAME_OVER_AUDIO_KEY)) {
      return false;
    }

    try {
      const adjustedVolume = this.getConfiguredAudioVolume('other', volume);
      const boostedVolume = Phaser.Math.Clamp(adjustedVolume * 1.6, 0, 1);
      const played = this.sound.play(GAME_OVER_AUDIO_KEY, {
        rate: Phaser.Math.Clamp(playbackRate, 0.78, 1.12),
        volume: boostedVolume,
      });
      return !!played;
    } catch (error) {
      return false;
    }
  },

  getTowerVfxProfile: function (tower) {
    if (!tower) {
      return WEAPON_VFX_TABLE[1];
    }
    return tower.getData('vfxProfile') || WEAPON_VFX_TABLE[tower.getData('towerId')] || WEAPON_VFX_TABLE[1];
  },

  spawnEnergyImpact: function (x, y, profile, baseRadius = sx(10)) {
    const core = this.add.circle(x, y, baseRadius * 0.4, profile.pulseCore, 0.55).setDepth(3.65);
    const ring = this.add.circle(x, y, baseRadius * 0.55, profile.pulseRing, 0)
      .setStrokeStyle(2, profile.pulseRing, 0.95)
      .setDepth(3.66);

    this.tweens.add({
      targets: core,
      alpha: 0,
      scale: 1.9,
      duration: 120,
      onComplete: () => core.destroy(),
    });

    this.tweens.add({
      targets: ring,
      alpha: 0,
      scale: 2.2,
      duration: 145,
      onComplete: () => ring.destroy(),
    });
  },

  getWeaponFirePalette: function (tower) {
    const pattern = tower.getData('firePattern') || 'single';
    if (pattern === 'laser' || pattern === 'lance') {
      return {
        core: 0xbef4ff,
        ring: 0xeafcff,
        tracer: 0xa8eeff,
      };
    }
    if (pattern === 'pulsar') {
      return {
        core: 0xd3b8ff,
        ring: 0xf0e6ff,
        tracer: 0xc7a6ff,
      };
    }
    return {
      core: 0xffcf8a,
      ring: 0xfff0d2,
      tracer: 0xffcb84,
    };
  },

  applyTowerRecoil: function (tower, angleRad, vfxProfile) {
    if (!tower?.active) {
      return;
    }

    const profile = vfxProfile || this.getTowerVfxProfile(tower);
    const duration = profile.recoilDuration || 85;
    const scaleDelta = profile.recoilScale || 0.03;
    const baseScale = tower.getData('baseScale') || tower.scaleX || 0.56;
    const towerBase = tower.getData('towerBase');
    const baseX = towerBase ? towerBase.x : tower.x;
    const baseY = towerBase ? towerBase.y : tower.y;
    tower.setData('baseScale', baseScale);

    this.tweens.killTweensOf(tower);
    tower.setPosition(baseX, baseY);
    tower.setScale(baseScale);
    const kickRotation = (Math.sin(angleRad || 0) * 0.035);
    const baseRotation = tower.rotation;

    this.tweens.add({
      targets: tower,
      rotation: baseRotation - kickRotation,
      scaleX: baseScale - scaleDelta,
      scaleY: baseScale - scaleDelta,
      duration,
      yoyo: true,
      ease: 'Quad.Out',
    });
  },

  spawnMuzzleFlash: function (tower, angleRad, palette, distance = sx(22), size = sx(6.5)) {
    if (!tower?.active) {
      return;
    }

    const profile = this.getTowerVfxProfile(tower);
    const fx = tower.x + Math.cos(angleRad) * distance;
    const fy = tower.y + Math.sin(angleRad) * distance;
    const muzzleTexture = profile.muzzleTexture || 'muzzleBallistic';
    const sprite = this.add.image(fx, fy, muzzleTexture)
      .setDepth(3.62)
      .setRotation(angleRad)
      .setTint(palette.core)
      .setScale(profile.class === 'rocket' ? 1.05 : profile.class === 'energy' ? 0.95 : 0.9)
      .setAlpha(0.92);

    const ring = this.add.circle(fx, fy, size * 0.88, palette.ring, 0)
      .setStrokeStyle(2, palette.ring, 0.58)
      .setDepth(3.61);

    this.tweens.add({
      targets: sprite,
      alpha: 0,
      scaleX: sprite.scaleX * 1.35,
      scaleY: sprite.scaleY * 1.18,
      duration: 90,
      onComplete: () => sprite.destroy(),
    });
    this.tweens.add({
      targets: ring,
      alpha: 0,
      scale: 1.6,
      duration: 95,
      onComplete: () => ring.destroy(),
    });
  },

  spawnProjectileTrail: function (projectile, vfxProfile) {
    if (!projectile?.active || !vfxProfile?.trailTexture) {
      return;
    }

    const trail = this.add.image(projectile.x, projectile.y, vfxProfile.trailTexture)
      .setDepth(2.86)
      .setRotation(Phaser.Math.DegToRad(projectile.angle || 0));

    if (vfxProfile.class === 'rocket') {
      trail.setScale(0.9).setAlpha(0.46);
      trail.setTint(0xcfd9e8);
    } else if (vfxProfile.class === 'energy') {
      trail.setScale(0.76).setAlpha(0.4);
      trail.setTint(0x9ee8ff);
    } else {
      trail.setScale(0.72).setAlpha(0.38);
      trail.setTint(0xffd29a);
    }

    this.tweens.add({
      targets: trail,
      alpha: 0,
      scaleX: trail.scaleX * 0.66,
      scaleY: trail.scaleY * 0.66,
      duration: vfxProfile.class === 'rocket' ? 160 : 110,
      onComplete: () => trail.destroy(),
    });
  },

  updateProjectileTrails: function () {
    const now = this.time.now;
    this.projectiles.children.entries.forEach((projectile) => {
      if (!projectile.active) {
        return;
      }

      const profile = projectile.getData('vfxProfile');
      if (!profile?.trailTexture) {
        return;
      }

      const lastTrailAt = projectile.getData('lastTrailAt') || 0;
      const trailGap = profile.class === 'rocket' ? 38 : profile.class === 'energy' ? 28 : 30;
      if (now - lastTrailAt < trailGap) {
        return;
      }

      projectile.setData('lastTrailAt', now);
      this.spawnProjectileTrail(projectile, profile);
    });
  },

  applyHeavyShotCameraPunch: function (vfxProfile) {
    return;
  },

  spawnShotTracer: function (x1, y1, x2, y2, color, width = sx(2.2), alpha = 0.62, duration = 95) {
    if (!DEBUG_FLAGS.lineFx) {
      return;
    }

    const tracer = this.add.line(0, 0, x1, y1, x2, y2, color, alpha)
      .setLineWidth(width, Math.max(1, width * 0.45))
      .setDepth(3.48);

    this.tweens.add({
      targets: tracer,
      alpha: 0,
      duration,
      onComplete: () => tracer.destroy(),
    });
  },

  getLaserBeamTextureKeys: function () {
    const platformProbe = (
      (typeof navigator !== 'undefined' ? (navigator.platform || '') + ' ' + (navigator.userAgent || '') : '')
    ).toLowerCase();
    const wantsWindows = platformProbe.includes('win');
    return wantsWindows ? LASER_BEAM_TEXTURE_KEY_SETS.windows : LASER_BEAM_TEXTURE_KEY_SETS.mac;
  },

  spawnLaserBeamProjectile: function (x1, y1, x2, y2, profile, tower = null, duration = 92, width = sx(4.8), tintColor = null) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const beamLength = Math.max(sx(10), Math.hypot(dx, dy));
    const angle = Phaser.Math.Angle.Between(x1, y1, x2, y2);
    const cx = x1 + (dx * 0.5);
    const cy = y1 + (dy * 0.5);
    const towerId = tower?.getData('towerId') || 0;
    const textureKeys = this.getLaserBeamTextureKeys();
    const beamTextureKey = textureKeys[(Math.max(1, towerId) - 1) % textureKeys.length] || textureKeys[0];
    const resolvedTint = tintColor !== null ? tintColor : (WEAPON_BEAM_TINT_MAP[towerId] || 0xffffff);
    const beamFrame = this.textures.getFrame(beamTextureKey);
    const sourceWidth = beamFrame?.width || 233;
    const sourceHeight = beamFrame?.height || 134;
    const widthIntensity = Phaser.Math.Clamp(width / sx(8), 0.9, 1.65);
    const displayHeight = Math.max(sx(24), (beamLength * (sourceHeight / sourceWidth)) * widthIntensity);

    const core = this.add.image(cx, cy, beamTextureKey)
      .setDisplaySize(beamLength, displayHeight)
      .setRotation(angle)
      .setBlendMode(Phaser.BlendModes.NORMAL)
      .setTint(resolvedTint)
      .setAlpha(0.94)
      .setDepth(3.42);

    const glow = this.add.image(cx, cy, beamTextureKey)
      .setDisplaySize(beamLength, displayHeight * 1.08)
      .setRotation(angle)
      .setBlendMode(Phaser.BlendModes.ADD)
      .setTint(resolvedTint)
      .setAlpha(0.24)
      .setDepth(3.39);

    this.tweens.add({
      targets: [core, glow],
      alpha: 0,
      duration,
      ease: 'Sine.Out',
      onComplete: () => {
        core.destroy();
        glow.destroy();
      },
    });
  },

  spawnRocketMuzzle: function (tower, angleRad) {
    const distance = sx(20);
    const fx = tower.x + Math.cos(angleRad) * distance;
    const fy = tower.y + Math.sin(angleRad) * distance;
    const flame = this.add.triangle(
      fx,
      fy,
      -sx(9),
      0,
      sx(5),
      -sx(3.5),
      sx(5),
      sx(3.5),
      0xffa056,
      0.86
    )
      .setDepth(3.63)
      .setRotation(angleRad + Math.PI)
      .setScale(0.85);

    this.tweens.add({
      targets: flame,
      alpha: 0,
      scaleX: 1.3,
      scaleY: 1.05,
      duration: 80,
      onComplete: () => flame.destroy(),
    });
  },

  triggerTowerFireAnimation: function (tower, durationMs = 320) {
    const fireAnimSprite = tower.getData('fireAnimSprite');
    const fireAnimKey = tower.getData('fireAnimKey');
    if (!fireAnimSprite || !fireAnimKey) {
      return;
    }

    const existingReset = tower.getData('fireAnimResetTimer');
    if (existingReset) {
      existingReset.remove(false);
    }

    fireAnimSprite
      .setPosition(tower.x, tower.y)
      .setRotation(tower.rotation)
      .setScale(tower.scaleX, tower.scaleY)
      .setVisible(true)
      .setAlpha(1)
      .play(fireAnimKey, true);

    tower.setAlpha(0.22);

    const resetTimer = this.time.delayedCall(durationMs, () => {
      if (!tower.active) {
        return;
      }

      tower.setAlpha(1);
      if (fireAnimSprite.active) {
        fireAnimSprite.stop();
        fireAnimSprite.setVisible(false).setAlpha(0);
      }
      tower.setData('fireAnimResetTimer', null);
    });

    tower.setData('fireAnimResetTimer', resetTimer);
  },

  fireTowerWeapon: function (tower, target) {
    return fireTowerWeaponSystem.call(this, tower, target);
  },

  fireRocketSalvo: function (tower, target) {
    const vfxProfile = this.getTowerVfxProfile(tower);
    const rocketCount = Math.max(1, tower.getData('rocketCount') || 6);
    const interval = tower.getData('rocketInterval') || 55;
    const spread = tower.getData('rocketSpread') || 16;
    this.triggerTowerFireAnimation(tower, (rocketCount * interval) + 220);

    for (let i = 0; i < rocketCount; i++) {
      this.time.delayedCall(i * interval, () => {
        if (!tower.active) {
          return;
        }

        const dynamicTarget = target.active ? target : this.selectEnemyForTower(tower);
        if (!dynamicTarget) {
          return;
        }

        const angleOffset = rocketCount === 1
          ? 0
          : -spread + ((i * (spread * 2)) / (rocketCount - 1));
        const projectile = this.fireProjectile(tower, dynamicTarget, angleOffset, {
          suppressDefaultFx: true,
          projectileKey: 'rocketProjectile',
        });
        if (!projectile) {
          return;
        }

        projectile.setTint(0xffb071);
        projectile.setBlendMode(Phaser.BlendModes.NORMAL);
        projectile.setScale((tower.getData('projectileScale') || 1.1) * 1.22);
        projectile.setData('damage', (tower.getData('damage') || 1) * 0.72);
        projectile.setData('splashRadius', tower.getData('rocketSplashRadius') || tower.getData('splashRadius') || sx(40));
        projectile.setData('splashDamageFactor', tower.getData('rocketSplashDamageFactor') || 0.58);
        projectile.setData('vfxProfile', vfxProfile);
        projectile.setAlpha(vfxProfile.projectileAlpha || 1);

        const angleRad = Phaser.Math.DegToRad(projectile.angle || 0);
        this.applyTowerRecoil(tower, angleRad, vfxProfile);
        this.spawnRocketMuzzle(tower, angleRad);
        this.playShotSfx(vfxProfile, 88, 0.05);
        this.applyHeavyShotCameraPunch(vfxProfile);
        this.recordFireDebugShot(tower, dynamicTarget, projectile.getData('damage') || 0);
        this.spawnShotTracer(
          tower.x + Math.cos(angleRad) * sx(20),
          tower.y + Math.sin(angleRad) * sx(20),
          tower.x + Math.cos(angleRad) * sx(90),
          tower.y + Math.sin(angleRad) * sx(90),
          0xffb670,
          sx(2.5),
          0.62,
          105
        );
      });
    }
  },

  fireLaserShot: function (tower, target) {
    const profile = this.getEnergyWeaponProfile(tower);
    const vfxProfile = this.getTowerVfxProfile(tower);
    const palette = this.getWeaponFirePalette(tower);
    const angle = Phaser.Math.Angle.Between(tower.x, tower.y, target.x, target.y);
    const dirX = Math.cos(angle);
    const dirY = Math.sin(angle);
    const range = tower.getData('range') || TOWER_RANGE;
    const laneRadius = Math.max(sx(12), tower.getData('laserLaneRadius') || sx(15));
    const pierceCount = Math.max(1, tower.getData('pierceCount') || 1);
    const beamDuration = Math.max(78, tower.getData('laserBeamDuration') || 86);
    const beamWidth = Math.max(sx(4), tower.getData('laserBeamWidth') || sx(4.4));
    const impactRadius = Math.max(sx(8), beamWidth * 1.35);

    const hits = [];
    this.enemies.children.entries.forEach((enemy) => {
      if (!enemy.active) {
        return;
      }

      const relX = enemy.x - tower.x;
      const relY = enemy.y - tower.y;
      const forward = (relX * dirX) + (relY * dirY);
      if (forward < 0 || forward > range) {
        return;
      }

      const lateral = Math.abs((relX * dirY) - (relY * dirX));
      if (lateral > laneRadius) {
        return;
      }

      hits.push({ enemy, forward });
    });

    hits.sort((a, b) => a.forward - b.forward);

    const maxTargets = Math.min(pierceCount, hits.length);
    for (let i = 0; i < maxTargets; i++) {
      const enemy = hits[i].enemy;
      const chainScale = i === 0 ? 1 : 0.8;
      const damage = this.calculateTowerDirectDamage(tower, enemy, chainScale);
      this.applyEnemyDamage(enemy, damage);
      this.recordFireDebugShot(tower, enemy, damage);
      this.applySlowToEnemy(enemy, tower.getData('slowAmount') || 0, tower.getData('slowDuration') || 0);
      this.spawnEnergyImpact(enemy.x, enemy.y, profile, impactRadius);
    }

    const beamStartX = tower.x + (dirX * sx(12));
    const beamStartY = tower.y + (dirY * sx(12));
    const beamEndX = tower.x + (dirX * range);
    const beamEndY = tower.y + (dirY * range);
    const towerId = tower?.getData('towerId') || 0;
    const tintColor = WEAPON_BEAM_TINT_MAP[towerId] || 0xffffff;
    this.spawnLaserBeamProjectile(beamStartX, beamStartY, beamEndX, beamEndY, profile, tower, beamDuration, beamWidth, tintColor);

    if (DEBUG_FLAGS.lineFx) {
      const beam = this.add.line(
        0,
        0,
        beamStartX,
        beamStartY,
        beamEndX,
        beamEndY,
        profile.beamColor,
        0.75
      )
        .setLineWidth(sx(2.3), sx(0.9))
        .setDepth(3.4);

      const glow = this.add.line(
        0,
        0,
        beamStartX,
        beamStartY,
        beamEndX,
        beamEndY,
        profile.beamGlow,
        0.45
      )
        .setLineWidth(sx(4.4), sx(1.2))
        .setDepth(3.35);

      this.tweens.add({
        targets: [beam, glow],
        alpha: 0,
        duration: 75,
        onComplete: () => {
          beam.destroy();
          glow.destroy();
        },
      });
    }

    this.applyTowerRecoil(tower, angle, vfxProfile);
    this.spawnMuzzleFlash(tower, angle, palette, sx(21), sx(7));
    this.applyHeavyShotCameraPunch(vfxProfile);

    this.playShotSfx(vfxProfile, 66, 0.05);
  },

  firePulsarBurst: function (tower, target) {
    const profile = this.getEnergyWeaponProfile(tower);
    const vfxProfile = this.getTowerVfxProfile(tower);
    const palette = this.getWeaponFirePalette(tower);
    const fireAngle = Phaser.Math.Angle.Between(tower.x, tower.y, target.x, target.y);
    const dirX = Math.cos(fireAngle);
    const dirY = Math.sin(fireAngle);
    const splashRadius = Math.max(sx(34), tower.getData('splashRadius') || sx(34));
    const splashFactor = Math.max(0.45, tower.getData('splashDamageFactor') || 0.55);
    const coreDamage = this.calculateTowerDirectDamage(tower, target, 1.08);
    this.applyEnemyDamage(target, coreDamage);
    this.recordFireDebugShot(tower, target, coreDamage);
    this.spawnEnergyImpact(target.x, target.y, profile, sx(12));

    this.enemies.children.entries.forEach((enemy) => {
      if (!enemy.active || enemy === target) {
        return;
      }

      const distance = Phaser.Math.Distance.Between(target.x, target.y, enemy.x, enemy.y);
      if (distance > splashRadius) {
        return;
      }

      const falloff = 1 - (distance / splashRadius);
      const splashDamage = this.calculateTowerDirectDamage(tower, enemy, splashFactor * (0.65 + (falloff * 0.35)));
      this.applyEnemyDamage(enemy, splashDamage);
      this.recordFireDebugShot(tower, enemy, splashDamage);
      this.applySlowToEnemy(enemy, tower.getData('slowAmount') || 0, tower.getData('slowDuration') || 0);
    });

    const pulse = this.add.circle(target.x, target.y, sx(12), profile.pulseCore, 0.3)
      .setStrokeStyle(3, profile.pulseRing, 0.95)
      .setDepth(3.5);

    const pulseGlow = this.add.circle(target.x, target.y, sx(10), profile.pulseRing, 0.16)
      .setDepth(3.46);

    this.tweens.add({
      targets: [pulse, pulseGlow],
      radius: splashRadius,
      alpha: 0,
      duration: 170,
      ease: 'Cubic.Out',
      onComplete: () => {
        pulse.destroy();
        pulseGlow.destroy();
      },
    });

    const beamStartX = tower.x + (dirX * sx(12));
    const beamStartY = tower.y + (dirY * sx(12));
    const beamEndX = target.x;
    const beamEndY = target.y;
    const towerId = tower?.getData('towerId') || 0;
    const tintColor = WEAPON_BEAM_TINT_MAP[towerId] || 0xffffff;
    this.spawnLaserBeamProjectile(beamStartX, beamStartY, beamEndX, beamEndY, profile, tower, 94, sx(5.2), tintColor);

    this.applyTowerRecoil(tower, fireAngle, vfxProfile);
    this.spawnMuzzleFlash(tower, fireAngle, palette, sx(22), sx(8));

    this.applyHeavyShotCameraPunch(vfxProfile);
    this.playShotSfx(vfxProfile, 92, 0.052);
  },

  fireLanceShot: function (tower, target) {
    const profile = this.getEnergyWeaponProfile(tower);
    const vfxProfile = this.getTowerVfxProfile(tower);
    const palette = this.getWeaponFirePalette(tower);
    const angle = Phaser.Math.Angle.Between(tower.x, tower.y, target.x, target.y);
    const dirX = Math.cos(angle);
    const dirY = Math.sin(angle);
    const range = tower.getData('range') || TOWER_RANGE;
    const laneRadius = sx(18);
    const pierceCount = Math.max(1, tower.getData('pierceCount') || 1);

    const hits = [];
    this.enemies.children.entries.forEach((enemy) => {
      if (!enemy.active) {
        return;
      }

      const relX = enemy.x - tower.x;
      const relY = enemy.y - tower.y;
      const forward = (relX * dirX) + (relY * dirY);
      if (forward < 0 || forward > range) {
        return;
      }

      const lateral = Math.abs((relX * dirY) - (relY * dirX));
      if (lateral > laneRadius) {
        return;
      }

      hits.push({ enemy, forward });
    });

    hits.sort((a, b) => a.forward - b.forward);

    const maxTargets = Math.min(pierceCount, hits.length);
    for (let i = 0; i < maxTargets; i++) {
      const enemy = hits[i].enemy;
      const chainScale = i === 0 ? 1 : 0.76;
      const damage = this.calculateTowerDirectDamage(tower, enemy, chainScale);
      this.applyEnemyDamage(enemy, damage);
      this.recordFireDebugShot(tower, enemy, damage);
      this.applySlowToEnemy(enemy, tower.getData('slowAmount') || 0, tower.getData('slowDuration') || 0);
      this.spawnEnergyImpact(enemy.x, enemy.y, profile, sx(10));
    }

    const beamLength = range;
    const beamStartX = tower.x + (dirX * sx(12));
    const beamStartY = tower.y + (dirY * sx(12));
    const beamEndX = tower.x + (dirX * beamLength);
    const beamEndY = tower.y + (dirY * beamLength);
    const towerId = tower?.getData('towerId') || 0;
    const tintColor = WEAPON_BEAM_TINT_MAP[towerId] || 0xffffff;
    this.spawnLaserBeamProjectile(beamStartX, beamStartY, beamEndX, beamEndY, profile, tower, 96, sx(5), tintColor);

    if (DEBUG_FLAGS.lineFx) {
      const beam = this.add.line(
        0,
        0,
        beamStartX,
        beamStartY,
        beamEndX,
        beamEndY,
        profile.beamColor,
        0.7
      )
        .setLineWidth(sx(3), sx(1.2))
        .setDepth(3.45);

      const beamGlow = this.add.line(
        0,
        0,
        beamStartX,
        beamStartY,
        beamEndX,
        beamEndY,
        profile.beamGlow,
        0.38
      )
        .setLineWidth(sx(5.4), sx(1.7))
        .setDepth(3.4);

      this.tweens.add({
        targets: [beam, beamGlow],
        alpha: 0,
        duration: 90,
        onComplete: () => {
          beam.destroy();
          beamGlow.destroy();
        },
      });
    }

    this.applyTowerRecoil(tower, angle, vfxProfile);
    this.spawnMuzzleFlash(tower, angle, palette, sx(22), sx(7.5));

    this.applyHeavyShotCameraPunch(vfxProfile);
    this.playShotSfx(vfxProfile, 82, 0.052);
  },

  calculateTowerDirectDamage: function (tower, enemy, damageScale = 1) {
    let damage = (tower.getData('damage') || 1) * damageScale;
    const armor = enemy.getData('armor') || 0;
    const armorPen = tower.getData('armorPen') || 0;
    const armorClass = enemy.getData('armorClass') || 'medium';

    if (armorClass === 'light') {
      damage *= tower.getData('lightBonus') || 1;
    } else if (armorClass === 'heavy') {
      damage *= tower.getData('heavyBonus') || 1;
    }

    const effectiveArmor = Math.max(0, armor - armorPen);
    damage *= Math.max(0.26, 1 - (effectiveArmor * 0.28));
    return damage;
  },

  fireProjectile: function (tower, target, angleOffset = 0, options = {}) {
    const vfxProfile = this.getTowerVfxProfile(tower);
    const defaultProjectileKey = vfxProfile.class === 'rocket'
      ? 'projectileRocketSprite'
      : vfxProfile.class === 'energy'
        ? 'projectileEnergySprite'
        : 'projectile';
    const projectileKey = options.projectileKey || defaultProjectileKey;
    const baseAimDeg = Phaser.Math.RadToDeg(
      Phaser.Math.Angle.Between(tower.x, tower.y, target.x, target.y)
    );
    const angle = (Number.isFinite(baseAimDeg) ? baseAimDeg : 0) + angleOffset;
    const angleRad = Phaser.Math.DegToRad(angle);

    let spawnX = tower.x;
    let spawnY = tower.y;
    const towerId = tower.getData('towerId') || 0;
    const isDualBarrelBurst = (tower.getData('firePattern') === 'burst') && (towerId === 1 || towerId === 2);
    if (isDualBarrelBurst) {
      const barrelSide = ((options.burstShotIndex || 0) % 2 === 0) ? -1 : 1;
      const forward = sx(16);
      const lateral = sx(7.2) * barrelSide;
      spawnX += (Math.cos(angleRad) * forward) + (-Math.sin(angleRad) * lateral);
      spawnY += (Math.sin(angleRad) * forward) + (Math.cos(angleRad) * lateral);
    } else if (Number.isInteger(options.barrelSlot) && (options.barrelCount || 0) > 1) {
      const barrelCount = Math.max(2, options.barrelCount || 2);
      const centerShift = (barrelCount - 1) * 0.5;
      const barrelIndex = Phaser.Math.Clamp(options.barrelSlot, 0, barrelCount - 1);
      const lateralUnits = barrelIndex - centerShift;
      const forward = sx(14);
      const lateral = sx(5.8) * lateralUnits;
      spawnX += (Math.cos(angleRad) * forward) + (-Math.sin(angleRad) * lateral);
      spawnY += (Math.sin(angleRad) * forward) + (Math.cos(angleRad) * lateral);
    }

    const projectile = this.projectiles.create(spawnX, spawnY, projectileKey);
    projectile.setDepth(3);
    projectile.setScale((tower.getData('projectileScale') || 1.15) * (vfxProfile.projectileScaleMult || 1));
    projectile.setBlendMode(vfxProfile.class === 'energy' ? Phaser.BlendModes.ADD : Phaser.BlendModes.NORMAL);
    projectile.setAlpha(vfxProfile.projectileAlpha || 1);
    projectile.setData('damage', tower.getData('damage') || 1);
    projectile.setData('armorPen', tower.getData('armorPen') || 0);
    projectile.setData('lightBonus', tower.getData('lightBonus') || 1);
    projectile.setData('heavyBonus', tower.getData('heavyBonus') || 1);
    projectile.setData('slowAmount', tower.getData('slowAmount') || 0);
    projectile.setData('slowDuration', tower.getData('slowDuration') || 0);
    projectile.setData('splashRadius', tower.getData('splashRadius') || 0);
    projectile.setData('splashDamageFactor', tower.getData('splashDamageFactor') || 0);
    projectile.setData('vfxProfile', vfxProfile);
    projectile.setData('lastTrailAt', 0);
    projectile.setData('firedAt', this.time.now || 0);
    projectile.setData('spawnX', spawnX);
    projectile.setData('spawnY', spawnY);
    const palette = this.getWeaponFirePalette(tower);
    if (vfxProfile.class === 'energy') {
      projectile.setTint(0x9ee8ff);
    } else if (vfxProfile.class === 'rocket') {
      projectile.setTint(0xffb071);
    } else {
      // Keep ballistic rounds warm so they read as shell fire, not white bubbles.
      const burstShotIndex = Number(options.burstShotIndex || 0);
      if (towerId === 2) {
        projectile.setTint((burstShotIndex % 2 === 0) ? 0xff9454 : 0xffd56f);
      } else {
        projectile.setTint(palette?.core || 0xffcf8a);
      }
    }

    if (!options.suppressDefaultFx) {
      this.applyTowerRecoil(tower, angleRad, vfxProfile);
      this.spawnMuzzleFlash(tower, angleRad, palette, sx(20), sx(6.2));
      this.playShotSfx(vfxProfile, vfxProfile.class === 'energy' ? 64 : 56, 0.042);
      this.spawnShotTracer(
        spawnX,
        spawnY,
        spawnX + Math.cos(angleRad) * sx(52),
        spawnY + Math.sin(angleRad) * sx(52),
        palette.tracer,
        sx(1.9),
        0.55,
        80
      );
    }
    this.recordFireDebugShot(tower, target, tower.getData('damage') || 0);
    projectile.setAngle(angle);

    let resolvedProjectileSpeed = Number(tower.getData('projectileSpeed'));
    if (!Number.isFinite(resolvedProjectileSpeed) || resolvedProjectileSpeed <= 0) {
      resolvedProjectileSpeed = 380;
    }
    if ((tower.getData('firePattern') || 'single') === 'burst') {
      const upgradeLevel = Math.max(1, Number(tower.getData('upgradeLevel') || 1));
      resolvedProjectileSpeed = Math.max(resolvedProjectileSpeed, 420 + ((upgradeLevel - 1) * 24));
    }

    this.physics.velocityFromRotation(angleRad, resolvedProjectileSpeed, projectile.body.velocity);
    if (
      !Number.isFinite(projectile.body?.velocity?.x)
      || !Number.isFinite(projectile.body?.velocity?.y)
      || (Math.abs(projectile.body.velocity.x) + Math.abs(projectile.body.velocity.y)) < 0.01
    ) {
      projectile.body.velocity.x = Math.cos(angleRad) * resolvedProjectileSpeed;
      projectile.body.velocity.y = Math.sin(angleRad) * resolvedProjectileSpeed;
    }
    projectile.setData('launchSpeed', resolvedProjectileSpeed);
    return projectile;
  },

  applySlowToEnemy: function (enemy, slowAmount, slowDuration) {
    if (!enemy.active || !slowAmount || !slowDuration) {
      return;
    }

    const factor = Phaser.Math.Clamp(1 - slowAmount, 0.45, 1);
    enemy.setData('slowFactor', Math.min(enemy.getData('slowFactor') || 1, factor));
    enemy.setData('slowUntil', this.time.now + slowDuration);
  },

  calculateProjectileDamage: function (projectile, enemy, damageScale = 1) {
    let damage = (projectile.getData('damage') || 1) * damageScale;
    const armor = enemy.getData('armor') || 0;
    const armorPen = projectile.getData('armorPen') || 0;
    const armorClass = enemy.getData('armorClass') || 'medium';

    if (armorClass === 'light') {
      damage *= projectile.getData('lightBonus') || 1;
    } else if (armorClass === 'heavy') {
      damage *= projectile.getData('heavyBonus') || 1;
    }

    const effectiveArmor = Math.max(0, armor - armorPen);
    damage *= Math.max(0.26, 1 - (effectiveArmor * 0.28));
    return damage;
  },

  applyProjectileSplash: function (projectile, originEnemy) {
    const splashRadius = projectile.getData('splashRadius') || 0;
    if (splashRadius <= 0) {
      return;
    }

    const splashDamageFactor = projectile.getData('splashDamageFactor') || 0.5;
    this.enemies.children.entries.forEach((enemy) => {
      if (!enemy.active || enemy === originEnemy) {
        return;
      }
      const distance = Phaser.Math.Distance.Between(originEnemy.x, originEnemy.y, enemy.x, enemy.y);
      if (distance > splashRadius) {
        return;
      }

      const splashDamage = this.calculateProjectileDamage(projectile, enemy, splashDamageFactor);
      this.applyEnemyDamage(enemy, splashDamage);
    });
  },

  applyEnemyWearVisual: function (enemy) {
    if (!enemy?.active) {
      return;
    }

    const health = Math.max(0, Number(enemy.getData('health') || 0));
    const maxHealth = Math.max(1, Number(enemy.getData('maxHealth') || 1));
    const ratio = Phaser.Math.Clamp(health / maxHealth, 0, 1);
    const wearLevel = Phaser.Math.Clamp(1 - ratio, 0, 1);
    const armorClass = enemy.getData('armorClass') || 'medium';

    let baseTint = Number(enemy.getData('baseTintColor'));
    if (!Number.isFinite(baseTint)) {
      baseTint = armorClass === 'heavy'
        ? 0xffc7a6
        : armorClass === 'medium'
          ? 0xd7f0ff
          : 0x9cd7ff;
      enemy.setData('baseTintColor', baseTint);
    }

    const baseColor = Phaser.Display.Color.IntegerToColor(baseTint);
    const wornTargetColor = armorClass === 'heavy'
      ? Phaser.Display.Color.IntegerToColor(0x5d3322)
      : armorClass === 'medium'
        ? Phaser.Display.Color.IntegerToColor(0x4a5364)
        : Phaser.Display.Color.IntegerToColor(0x4f4f59);
    const wearBlend = Phaser.Math.Clamp(wearLevel * 0.9, 0, 0.9);
    const wornColor = Phaser.Display.Color.Interpolate.ColorWithColor(baseColor, wornTargetColor, 100, Math.round(wearBlend * 100));
    const packedTint = Phaser.Display.Color.GetColor(wornColor.r, wornColor.g, wornColor.b);
    enemy.setTint(packedTint);
    enemy.setAlpha(Phaser.Math.Clamp(1 - (wearLevel * 0.12), 0.84, 1));

    this._updateEnemyDamageEffects(enemy, ratio);

    if (typeof this.updateEnemyWearMarkers === 'function') {
      this.updateEnemyWearMarkers(enemy);
    }
  },

  _updateEnemyDamageEffects: function (enemy, healthRatio) {
    const isSoldier = !!enemy.getData('isSoldier');
    const isVehicle = !isSoldier && !enemy.getData('isPlane');
    const wantSmoke = healthRatio <= 0.55;
    const wantFire = false;
    const damageLevel = Phaser.Math.Clamp(1 - healthRatio, 0, 1);
    const baseScale = isVehicle ? 0.44 : 0.3;
    const scale = baseScale + ((isVehicle ? 0.42 : 0.24) * damageLevel);
    const offsetY = isVehicle ? -sy(10) : -sy(6);

    // Smoke sprite.
    let smoke = enemy.getData('wearSmokeFx');
    if (wantSmoke && !smoke) {
      smoke = this.add.image(enemy.x, enemy.y + offsetY, 'wearSmokeFrame1')
        .setDepth((enemy.depth || 3) + 0.22)
        .setScale(scale)
        .setAlpha(0.72)
        .setBlendMode(Phaser.BlendModes.NORMAL);
      smoke.setData('frameIndex', 0);
      smoke.setData('offsetY', offsetY);
      const smokeTimer = this.time.addEvent({
        delay: 110,
        loop: true,
        callback: () => {
          if (!smoke?.active || !enemy?.active) { smokeTimer.remove(); return; }
          const f = ((smoke.getData('frameIndex') || 0) + 1) % 6;
          smoke.setData('frameIndex', f);
          smoke.setTexture('wearSmokeFrame' + (f + 1));
          smoke.setPosition(enemy.x, enemy.y + offsetY);
        },
      });
      smoke.setData('timer', smokeTimer);
      enemy.setData('wearSmokeFx', smoke);
    } else if (!wantSmoke && smoke) {
      smoke.getData('timer')?.remove();
      smoke.destroy();
      enemy.setData('wearSmokeFx', null);
    } else if (smoke?.active) {
      smoke.setPosition(enemy.x, enemy.y + offsetY);
      smoke.setDepth((enemy.depth || 3) + 0.22);
      smoke.setScale(scale);
      smoke.setAlpha(Phaser.Math.Clamp(0.42 + (damageLevel * 0.48), 0.42, 0.9));
    }

    // Fire sprite (only when critically damaged).
    let fire = enemy.getData('wearFireFx');
    if (wantFire && !fire) {
      fire = this.add.image(enemy.x, enemy.y + offsetY, 'wearFireFrame1')
        .setDepth((enemy.depth || 3) + 0.24)
        .setScale(scale * 0.82)
        .setAlpha(0.88)
        .setBlendMode(Phaser.BlendModes.NORMAL);
      fire.setData('frameIndex', 0);
      fire.setData('offsetY', offsetY);
      const fireTimer = this.time.addEvent({
        delay: 80,
        loop: true,
        callback: () => {
          if (!fire?.active || !enemy?.active) { fireTimer.remove(); return; }
          const f = ((fire.getData('frameIndex') || 0) + 1) % 6;
          fire.setData('frameIndex', f);
          fire.setTexture('wearFireFrame' + (f + 1));
          fire.setPosition(enemy.x, enemy.y + offsetY);
        },
      });
      fire.setData('timer', fireTimer);
      enemy.setData('wearFireFx', fire);
    } else if (!wantFire && fire) {
      fire.getData('timer')?.remove();
      fire.destroy();
      enemy.setData('wearFireFx', null);
    } else if (fire?.active) {
      fire.setPosition(enemy.x, enemy.y + offsetY);
      fire.setDepth((enemy.depth || 3) + 0.24);
    }
  },

  syncEnemyHealthVisual: function (enemy) {
    if (!enemy || !enemy.active) {
      return;
    }

    const health = Math.max(0, enemy.getData('health') || 0);
    const maxHealth = Math.max(1, enemy.getData('maxHealth') || 1);
    const ratio = health / maxHealth;
    const barFill = enemy.getData('barFill');
    if (barFill) {
      barFill.width = Math.max(0, sx(28) * ratio);
      if (enemy.getData('isEliteSoldier')) {
        if (ratio > 0.65) {
          barFill.fillColor = 0xfff0a8;
        } else if (ratio > 0.35) {
          barFill.fillColor = 0xffd36d;
        } else {
          barFill.fillColor = 0xff9866;
        }
      } else if (ratio > 0.65) {
        barFill.fillColor = 0xff849b;
      } else if (ratio > 0.35) {
        barFill.fillColor = 0xffbf7d;
      } else {
        barFill.fillColor = 0xff5f79;
      }
    }

    this.applyEnemyWearVisual(enemy);
  },

  applyEnemyDamage: function (enemy, damage, impactPoint = null) {
    if (!enemy?.active || enemy.getData('isDying')) {
      return false;
    }

    if (DEBUG_FLAGS.soldiersInvincibleForTesting && enemy.getData('isSoldier')) {
      const currentHealth = Math.max(1, Number(enemy.getData('health') || 1));
      enemy.setData('health', currentHealth);
      this.syncEnemyHealthVisual(enemy);
      return false;
    }

    const currentHealth = Math.max(0, Number(enemy.getData('health') || 0));
    const appliedDamage = Math.max(0, Math.min(currentHealth, Number(damage) || 0));
    const health = Math.max(0, currentHealth - appliedDamage);
    this.waveDamageDealt = Math.max(0, Number(this.waveDamageDealt || 0) + appliedDamage);
    enemy.setData('health', health);

    if (enemy.getData('isTestDummy')) {
      enemy.setData('health', Math.max(1, health));
      this.syncEnemyHealthVisual(enemy);
      enemy.setTintFill(0xffffff);
      this.time.delayedCall(55, () => {
        if (enemy.active) {
          enemy.clearTint();
          this.applyEnemyWearVisual(enemy);
        }
      });
      return false;
    }

    this.syncEnemyHealthVisual(enemy);

    if (health > 0) {
      if (enemy.getData('isSoldier')) {
        this.triggerSoldierHurtPose(enemy);
      }
      return false;
    }

    const enemyType = enemy.getData('enemyType');
    const isTankDeath = enemyType === 'tank';
    const isPlaneDeath = enemyType === 'plane';
    this.triggerEnemyDeathExplosion(enemy, impactPoint);

    if (isTankDeath || isPlaneDeath) {
      enemy.setData('isDying', true);
      enemy.setData('speed', 0);
      enemy.setData('attackRange', 0);
      enemy.setData('fireRate', Number.MAX_SAFE_INTEGER);
      this.time.delayedCall(isPlaneDeath ? 165 : 190, () => {
        this.finalizeEnemyDeath(enemy);
      });
      return true;
    }

    this.finalizeEnemyDeath(enemy);

    return true;
  },

  finalizeEnemyDeath: function (enemy) {
    if (!enemy?.active) {
      return;
    }

    const enemySnapshot = {
      enemyType: enemy.getData('enemyType'),
      isPlane: !!enemy.getData('isPlane'),
      isEliteSoldier: !!enemy.getData('isEliteSoldier'),
      isHumvee: !!enemy.getData('isHumvee'),
    };

    const baseKillGold = this.getDifficultyConfig()?.killGold ?? 3;
    const isTank = enemySnapshot.enemyType === 'tank';
    const isHumveeKill = !!enemySnapshot.isHumvee;
    const isPlane = enemySnapshot.enemyType === 'plane' || enemySnapshot.isPlane;
    const isElite = enemySnapshot.isEliteSoldier;

    this.destroyEnemyVisuals(enemy);
    this.registerEnemyDefeat(enemy);
    enemy.destroy();
    this.resolveWaveEnemy();
    this.enemiesDefeated += 1;
    vibrateImpact(isTank ? 'Heavy' : 'Light');

    const killGold = isTank      ? baseKillGold * SPECIAL_KILL_GOLD_MULTIPLIERS.tank
      : isPlane                  ? baseKillGold * SPECIAL_KILL_GOLD_MULTIPLIERS.plane
      : isElite                  ? baseKillGold * SPECIAL_KILL_GOLD_MULTIPLIERS.elite
      : isHumveeKill             ? baseKillGold * SPECIAL_KILL_GOLD_MULTIPLIERS.humvee
      :                            baseKillGold;

    const killScore = Math.round(killGold * (this.getDifficultyConfig()?.scoreMultiplier ?? 1));
    const suppliesEarned = this.awardSuppliesDrop(enemySnapshot);
    this.waveSuppliesEarned = Math.max(0, Number(this.waveSuppliesEarned || 0) + suppliesEarned);
    this.gameState.gold += killGold;
    this.gameState.score += killScore;
    this.earnCommanderXP(isTank ? COMMANDER_XP_PER_KILL * 4 : isPlane ? COMMANDER_XP_PER_KILL * 3 : COMMANDER_XP_PER_KILL);
    this.updateHud();
    const suppliesText = suppliesEarned > 0 ? ' +' + suppliesEarned + ' supplies.' : '';
    this.setStatus('Target destroyed. +' + killGold + ' gold, +' + killScore + ' score.' + suppliesText, '#89ffd0');
  },

  awardSuppliesDrop: function (enemy) {
    if (!this.gameState) {
      return 0;
    }

    if (!Number.isFinite(this.gameState.techParts)) {
      this.gameState.techParts = 0;
    }

    const enemyType = typeof enemy?.getData === 'function'
      ? enemy.getData('enemyType')
      : enemy?.enemyType;
    const isPlaneFlag = typeof enemy?.getData === 'function'
      ? !!enemy.getData('isPlane')
      : !!enemy?.isPlane;
    const isEliteSoldierFlag = typeof enemy?.getData === 'function'
      ? !!enemy.getData('isEliteSoldier')
      : !!enemy?.isEliteSoldier;

    const isTank = enemyType === 'tank';
    const isPlane = enemyType === 'plane' || isPlaneFlag;
    const isEliteSoldier = isEliteSoldierFlag;

    let rule = null;
    if (isTank) {
      rule = SUPPLIES_DROP_RULES.tank;
    } else if (isPlane) {
      rule = SUPPLIES_DROP_RULES.plane;
    } else if (isEliteSoldier) {
      rule = SUPPLIES_DROP_RULES.eliteSoldier;
    }

    if (!rule || Math.random() > rule.chance) {
      return 0;
    }

    const rolled = rule.max > rule.min
      ? (Math.random() < 0.28 ? rule.max : rule.min)
      : rule.min;
    const capLeft = Math.max(0, SUPPLIES_MAX_STASH - this.gameState.techParts);
    const granted = Math.min(rolled, capLeft);
    if (granted <= 0) {
      return 0;
    }

    this.gameState.techParts += granted;
    return granted;
  },

  playExplosionAnimation: function (x, y, frameKeys, options = {}) {
    if (!Array.isArray(frameKeys) || frameKeys.length === 0) {
      return;
    }

    this.playExplosionSfx(options.sfxRate || 1, options.sfxVolume || 1.0);

    const scale = options.scale || 1;
    const depth = options.depth || 9.4;
    const alpha = options.alpha || 0.96;
    const tint = options.tint || null;

    const blast = this.add.image(x, y, frameKeys[0])
      .setScale(scale)
      .setDepth(depth)
      .setAlpha(alpha);
    blast.setBlendMode(Phaser.BlendModes.NORMAL);

    if (tint) {
      blast.setTint(tint);
    }
    const frameDuration = options.frameDuration || 96;
    let frameIndex = 0;
    this.time.addEvent({
      delay: frameDuration,
      repeat: frameKeys.length - 1,
      callback: () => {
        frameIndex += 1;
        if (!blast.active) {
          return;
        }
        if (frameIndex < frameKeys.length) {
          blast.setTexture(frameKeys[frameIndex]);
          return;
        }
        blast.destroy();
      },
    });
    this.time.delayedCall((frameDuration * frameKeys.length) + 60, () => {
      if (blast.active) {
        blast.destroy();
      }
    });

    if (options.showFlash !== false) {
      const flash = this.add.circle(x, y, options.flashRadius || sx(34), options.flashColor || 0xff8f32, 0.88)
        .setDepth(depth - 0.05)
        .setBlendMode(Phaser.BlendModes.NORMAL);
      this.tweens.add({
        targets: flash,
        scaleX: 1.9,
        scaleY: 1.9,
        alpha: 0,
        duration: options.flashDuration || 220,
        ease: 'Quad.Out',
        onComplete: () => flash.destroy(),
      });
    }

    if (options.showCore !== false) {
      const coreFlash = this.add.circle(x, y, options.coreRadius || sx(12), options.coreColor || 0xfff3c1, 0.92)
        .setDepth(depth + 0.02)
        .setBlendMode(Phaser.BlendModes.NORMAL);
      this.tweens.add({
        targets: coreFlash,
        scaleX: 1.8,
        scaleY: 1.8,
        alpha: 0,
        duration: options.coreDuration || 160,
        ease: 'Quad.Out',
        onComplete: () => coreFlash.destroy(),
      });
    }

    if (options.showShockRing !== false) {
      const shockRing = this.add.circle(x, y, options.ringRadius || sx(10), 0x000000, 0)
        .setDepth(depth + 0.01)
        .setStrokeStyle(Math.max(2, sx(3)), options.ringColor || 0xff5a2f, 0.95)
        .setBlendMode(Phaser.BlendModes.NORMAL);
      this.tweens.add({
        targets: shockRing,
        scaleX: 3,
        scaleY: 3,
        alpha: 0,
        duration: options.ringDuration || 260,
        ease: 'Cubic.Out',
        onComplete: () => shockRing.destroy(),
      });
    }

    if (options.showAfterglow !== false) {
      const afterglow = this.add.circle(x, y, options.afterglowRadius || sx(28), options.afterglowColor || 0x7a2f1f, 0.52)
        .setDepth(depth - 0.12)
        .setBlendMode(Phaser.BlendModes.NORMAL);
      this.tweens.add({
        targets: afterglow,
        scaleX: 2.35,
        scaleY: 2.35,
        alpha: 0,
        duration: options.afterglowDuration || 980,
        ease: 'Sine.Out',
        onComplete: () => afterglow.destroy(),
      });
    }

  },

  playCleanBurst: function (x, y, options = {}) {
    const frameKeys = options.frameKeys || [];
    if (!frameKeys.length) return;
    const scale = Number.isFinite(options.scale) ? options.scale : 1;
    const depth = options.depth || 9.6;
    const frameDuration = Number.isFinite(options.frameDuration) ? options.frameDuration : 55;

    const img = this.add.image(x, y, frameKeys[0])
      .setDepth(depth)
      .setScale(scale)
      .setAlpha(1)
      .setBlendMode(Phaser.BlendModes.NORMAL);

    let frameIndex = 0;
    this.time.addEvent({
      delay: frameDuration,
      repeat: frameKeys.length - 1,
      callback: () => {
        frameIndex += 1;
        if (!img.active) return;
        if (frameIndex < frameKeys.length) {
          img.setTexture(frameKeys[frameIndex]);
        } else {
          img.destroy();
        }
      },
    });
  },


  spawnEnemyDamagePopup: function (x, y, damage, color = '#ffd7a6') {
    if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(damage) || damage <= 0) {
      return;
    }

    const label = this.add.text(x, y - sy(28), '-' + damage.toFixed(damage >= 10 ? 0 : 1), {
      fontFamily: 'Arial Black, Arial, sans-serif',
      fontSize: Math.max(12, Math.round(sx(12))) + 'px',
      color,
      stroke: '#1a0f0a',
      strokeThickness: 3,
      align: 'center',
    })
      .setOrigin(0.5)
      .setDepth(10.6)
      .setAlpha(0.98);

    this.tweens.add({
      targets: label,
      y: label.y - sy(22),
      alpha: 0,
      duration: 460,
      ease: 'Cubic.Out',
      onComplete: () => {
        if (label?.active) {
          label.destroy();
        }
      },
    });
  },

  updateEnemyWearMarkers: function (enemy) {
    if (!enemy?.active) {
      return;
    }

    const marks = enemy.getData('wearMarks');
    if (!Array.isArray(marks) || marks.length === 0) {
      return;
    }

    const health = Math.max(0, Number(enemy.getData('health') || 0));
    const maxHealth = Math.max(1, Number(enemy.getData('maxHealth') || 1));
    const wearLevel = Phaser.Math.Clamp(1 - (health / maxHealth), 0, 1);
    const baseAlpha = Phaser.Math.Linear(0.14, 0.58, wearLevel);

    for (let i = marks.length - 1; i >= 0; i -= 1) {
      const mark = marks[i];
      if (!mark?.active) {
        marks.splice(i, 1);
        continue;
      }

      const offsetX = Number(mark.getData('offsetX') || 0);
      const offsetY = Number(mark.getData('offsetY') || 0);
      const ageFactor = Number(mark.getData('ageFactor') || 1);
      mark.setPosition(enemy.x + offsetX, enemy.y + offsetY);
      mark.setDepth((enemy.depth || 3) + 0.16);
      mark.setAlpha(Phaser.Math.Clamp(baseAlpha * ageFactor, 0.08, 0.64));
    }
  },

  spawnEnemyWearMark: function (enemy, x, y, damage = 0) {
    if (!enemy?.active || !Number.isFinite(x) || !Number.isFinite(y)) {
      return;
    }

    const size = Phaser.Math.Clamp(sx(6) + (Math.log2(1 + Math.max(0, Number(damage) || 0)) * sx(1.6)), sx(5), sx(13));
    const mark = this.add.ellipse(x, y, size, size * Phaser.Math.FloatBetween(0.72, 1.18), 0x2f150d, 0.7)
      .setDepth((enemy.depth || 3) + 0.16)
      .setBlendMode(Phaser.BlendModes.MULTIPLY)
      .setRotation(Phaser.Math.FloatBetween(-0.6, 0.6));

    const marks = enemy.getData('wearMarks') || [];
    marks.push(mark);
    enemy.setData('wearMarks', marks);

    mark.setData('offsetX', x - enemy.x);
    mark.setData('offsetY', y - enemy.y);
    mark.setData('ageFactor', Phaser.Math.FloatBetween(0.85, 1));

    const maxMarks = enemy.getData('isTestDummy') ? 14 : 7;
    while (marks.length > maxMarks) {
      const old = marks.shift();
      if (old?.active) {
        old.destroy();
      }
    }

    this.updateEnemyWearMarkers(enemy);
  },

  spawnTowerProjectileHitFx: function (projectile, enemy, x, y, damage) {
    if (!enemy?.active || !Number.isFinite(x) || !Number.isFinite(y)) {
      return;
    }

    const projectileKey = String(projectile?.texture?.key || '');
    const projectileClass = String(projectile?.getData?.('vfxProfile')?.class || '');
    const useGrenadeStyleImpact = projectileClass === 'rocket' || projectileKey === 'rocketProjectile';
    const enemyType = String(enemy.getData('enemyType') || '');
    const isTankLikeTarget = enemyType === 'tank' || !!enemy.getData('isHumvee') || !!enemy.getData('isTestDummy');
    const isSoldier = !!enemy.getData('isSoldier');
    const isPlane = !!enemy.getData('isPlane');
    const isGroundVehicle = !isSoldier && !isPlane;
    const shadow = enemy.getData('shadow');
    const groundImpactX = shadow?.active ? shadow.x : enemy.x;
    const shadowOffsetY = Number(enemy.getData('shadowOffsetY'));
    const fallbackGroundOffset = isSoldier ? sy(12) : sy(18);
    const groundImpactY = isGroundVehicle
      ? (shadow?.active ? shadow.y : (enemy.y + sy(18)))
      : (Number.isFinite(shadowOffsetY)
        ? (enemy.y + shadowOffsetY - sy(6))
        : (y + fallbackGroundOffset));

    enemy.setTintFill(0xfff1d6);
    this.time.delayedCall(85, () => {
      if (enemy?.active) {
        enemy.clearTint();
        this.applyEnemyWearVisual(enemy);
      }
    });

    this.spawnEnemyDamagePopup(x, y, damage, '#ffd7a6');
  },

  triggerEnemyDeathExplosion: function (enemy, impactPoint = null) {
    if (!enemy || !enemy.active) {
      return;
    }

    const explosionX = Number.isFinite(impactPoint?.x)
      ? impactPoint.x
      : enemy.x;
    const baseExplosionY = Number.isFinite(impactPoint?.y)
      ? impactPoint.y
      : enemy.y;
    // Explosion frames are visually weighted downward, so nudge upward to center on target bodies.
    const baseLiftScale = enemy.getData('enemyType') === 'tank' ? 0.42 : 0.33;
    const visualCenterLift = Phaser.Math.Clamp((enemy.displayHeight || sy(28)) * baseLiftScale, sy(8), sy(26)) + sy(4);
    const explosionY = baseExplosionY - visualCenterLift;

    const enemyType = enemy.getData('enemyType');
    const isEliteSoldier = !!enemy.getData('isEliteSoldier');
    const isTank = enemyType === 'tank';
    const isPlane = enemyType === 'plane';

    if (isTank || isPlane) {
      this.playCleanBurst(explosionX, explosionY, {
        frameKeys: Array.from({ length: 12 }, (_, i) => 'tankExplosionFrame' + (i + 1)),
        scale: isPlane ? 0.9 : 1.0,
        depth: 9.7,
        frameDuration: 52,
      });
      this.cameras.main.shake(isPlane ? 14 : 18, isPlane ? 0.0005 : 0.0007);
      return;
    }

    if (isEliteSoldier) {
      this.playEliteDeathGroanSfx(0.94, 0.82);
    }

    this.playCleanBurst(explosionX, explosionY, {
      frameKeys: Array.from({ length: 8 }, (_, i) => 'soldierExplosionFrame' + (i + 1)),
      scale: isEliteSoldier ? 0.88 : 0.76,
      depth: 9.7,
      frameDuration: 50,
    });
  },

  registerEnemyDefeat: function (enemy) {
    const type = enemy.getData('enemyType') || (enemy.getData('isSoldier') ? 'soldier' : 'tank');
    if (!this.enemyDefeatStats) {
      this.enemyDefeatStats = {
        soldier: 0,
        tank: 0,
        plane: 0,
      };
    }
    if (type === 'soldier') {
      this.enemyDefeatStats.soldier += 1;
      return;
    }
    if (type === 'plane') {
      this.enemyDefeatStats.plane += 1;
      return;
    }
    this.enemyDefeatStats.tank += 1;
  },

  projectileHit: function (projectile, enemy) {
    const impactX = enemy.x;
    const impactY = enemy.y;
    const vfxProfile = projectile.getData('vfxProfile') || null;
    if (vfxProfile?.class === 'rocket') {
      this.playRocketImpactSfx(vfxProfile);
    }
    projectile.destroy();
    const damage = this.calculateProjectileDamage(projectile, enemy, 1);
    this.spawnTowerProjectileHitFx(projectile, enemy, impactX, impactY, damage);
    this.applyEnemyDamage(enemy, damage, { x: impactX, y: impactY });
    this.applySlowToEnemy(enemy, projectile.getData('slowAmount') || 0, projectile.getData('slowDuration') || 0);
    this.applyProjectileSplash(projectile, enemy);
  },

  destroyEnemyVisuals: function (enemy) {
    const shadow = enemy.getData('shadow');
    const barBg = enemy.getData('barBg');
    const barFill = enemy.getData('barFill');
    const soldierGun = enemy.getData('soldierGun');
    const soldierEmote = enemy.getData('soldierEmote');
    const smokeFx = enemy.getData('singleSoldierPathSmokeFx');
    const tankGun = enemy.getData('tankGun');
    const humveeGun = enemy.getData('humveeGun');
    const wearMarks = enemy.getData('wearMarks');
    const wearSmokeFx = enemy.getData('wearSmokeFx');
    const wearFireFx  = enemy.getData('wearFireFx');

    if (shadow) {
      shadow.destroy();
    }
    if (barBg) {
      barBg.destroy();
    }
    if (barFill) {
      barFill.destroy();
    }
    if (soldierGun) {
      soldierGun.destroy();
    }
    if (soldierEmote) {
      soldierEmote.destroy();
    }
    if (smokeFx) {
      smokeFx.destroy(true);
    }
    if (tankGun) {
      tankGun.destroy();
    }
    if (humveeGun) {
      humveeGun.destroy();
    }
    if (Array.isArray(wearMarks)) {
      wearMarks.forEach((mark) => {
        if (mark?.active) {
          mark.destroy();
        }
      });
      enemy.setData('wearMarks', []);
    }
    if (wearSmokeFx) {
      wearSmokeFx.getData('timer')?.remove();
      if (wearSmokeFx.active) wearSmokeFx.destroy();
      enemy.setData('wearSmokeFx', null);
    }
    if (wearFireFx) {
      wearFireFx.getData('timer')?.remove();
      if (wearFireFx.active) wearFireFx.destroy();
      enemy.setData('wearFireFx', null);
    }
  },

  nextWave: function () {
    if (this.gameState?.gameOver) {
      return;
    }

    const completedWave = Math.max(1, Number(this.gameState?.wave || 1));

    const isLandingAttractMode = typeof window !== 'undefined' && window.__landingAttractMode === true;
    if (isLandingAttractMode) {
      this.handleWaveCompletionProgression(completedWave);
      this.repairTowersBetweenWaves();
      this.gameState.prepPhase = false;
      this.selectedPlacedTower = null;
      this.time.delayedCall(200, () => {
        this.gameState.gameOver = false;
        this.gameState.wave = 1;
        this.gameState.level = 1;
        this.gameState.lives = 9999;
        this.applyFortressLayoutForWave(1);
        this.applyPathLayoutForWave(1, true);
        this.setStatus('', '#89ffd0');
        this.startWave();
      });
      return;
    }

    this.stopThemeMusic();
    this.handleWaveCompletionProgression(completedWave);
    this.repairTowersBetweenWaves();
    const awardedGold = Math.max(0, Number(this.lastWaveCompletionGoldBonus || 0));

  const nextWaveNumber = completedWave >= 5 ? 1 : (completedWave + 1);
    const waveSummary = this.buildWaveTransitionSummary(completedWave, nextWaveNumber, awardedGold);
    // Merge any pending online weapon unlocks earned this wave into the summary.
    if (Array.isArray(this._pendingOnlineWeaponUnlocks) && this._pendingOnlineWeaponUnlocks.length > 0) {
      if (!waveSummary.unlockedWeapon) {
        const def = this._pendingOnlineWeaponUnlocks[0];
        const damage = Math.max(0, Number(def.baseDamage || def.damage || 0));
        const range = Math.max(0, Number(def.range || 0));
        const fireRatePerSec = def.fireRate > 0 ? (1000 / Number(def.fireRate)) : 0;
        waveSummary.unlockedWeapon = {
          id: def.id,
          name: def.name || 'Online Unlock',
          role: ((def.role || 'Online Exclusive')).toUpperCase(),
          description: def.description || 'Unlocked through online play.',
          assetPath: def.assetPath || '',
          textureKey: def.key || '',
          stats: { damage, range, fireRate: fireRatePerSec, dps: damage * fireRatePerSec, aoe: 0 },
        };
      }
      this._pendingOnlineWeaponUnlocks = [];
    }
    this.gameState.prepPhase = true;
    this.selectedPlacedTower = null;
    this.refreshSelectedPlacedTowerDetails();
    this.setStatus('Wave ' + completedWave + ' Finished  +Gold ' + awardedGold, '#89ffd0');

    if (this.startWaveButton) {
      this.startWaveButton.disableInteractive();
      this.startWaveButton.setFillStyle(0x3f5c52, 0.82);
    }
    if (this.startWaveButtonLabel) {
      this.startWaveButtonLabel.setText('WAVE ' + completedWave + ' FINISHED');
      this.startWaveButtonLabel.setColor('#baf8d5');
    }
    if (this.weaponReachGlowLayer) {
      this.weaponReachGlowLayer.setVisible(false);
    }

    // Collect upgradeable weapons the player owns (unlocked catalog defs)
    const canUpgradeDefenderTowers = !this.isMultiplayerEnemyCommanderRole?.();
    const cap = this.getTowerUpgradeCapForPlayerLevel();
    const upgradeableTowers = canUpgradeDefenderTowers
      ? (this.towerCatalog || []).filter(def => {
        if (!this.isWeaponUnlockedForPlayer(def)) return false;
        const currentLevel = (this.gameState?.weaponUpgradeLevels?.[def.key] || 1);
        return currentLevel < cap;
      })
      : [];

    // Block NEXT WAVE / Replay until upgrade modal has been shown and dismissed
    const setWaveClearActionsLocked = (locked) => {
      const els = this.htmlWaveClearElements;
      if (!els) return;
      // Lock all three wave-clear buttons
      [els.continueButton, els.replayButton, els.homeButton].forEach(btn => {
        if (!btn) return;
        btn.disabled = locked;
        btn.style.opacity = locked ? '0.35' : '';
        btn.style.pointerEvents = locked ? 'none' : '';
      });
      // Also lock HUD RESTART so it can't bypass the splash flow
      const hudRestart = document.querySelector('[data-hud-action="restart"]');
      if (hudRestart) {
        hudRestart.style.pointerEvents = locked ? 'none' : '';
        hudRestart.style.opacity = locked ? '0.35' : '';
      }
    };

    // Always lock actions when splash shows; unlock after upgrade modal (and unlock card) are resolved
    const revealDelay = this.getWaveTransitionUnlockRevealDelayMs(waveSummary);
    setWaveClearActionsLocked(true);

    if (upgradeableTowers.length > 0) {
      this._upgradeModalTimer = window.setTimeout(() => {
        this._upgradeModalTimer = null;
        if (this.htmlWaveClearOverlayNode?.style.display !== 'none') {
          this.showUpgradeModal(upgradeableTowers, () => {});
        }
      }, revealDelay);
    }
    // No-upgrade path: buttons auto-unlock via the splash timer above.

    this.showWaveTransitionSplash(waveSummary, (action = 'continue') => {
      console.log('[WAVE] showWaveTransitionSplash callback fired, action=' + action);
      this.suppressPlacedTowerFocusUntil = (this.time?.now || 0) + 320;
      this.selectedPlacedTower = null;
      this.refreshSelectedPlacedTowerDetails();
      if (this._upgradeModalTimer) {
        window.clearTimeout(this._upgradeModalTimer);
        this._upgradeModalTimer = null;
      }
      const upgradeModalEl = document.getElementById('upgrade-modal-root');
      if (upgradeModalEl) upgradeModalEl.remove();

      if (action === 'home') {
        this.returnToWorldSelectFromHud();
        return;
      }

      const proceedToNextWave = () => {
        console.log('[WAVE] proceedToNextWave called');
        document.querySelectorAll('[data-wave-clear-root]').forEach(el => { el.style.pointerEvents = 'none'; });

        try {
          const targetWaveNumber = action === 'replay' ? completedWave : nextWaveNumber;
          console.log('[WAVE] setting up wave ' + targetWaveNumber);
          this.gameState.wave = targetWaveNumber;
          this.gameState.level = targetWaveNumber;
          this.applyFortressLayoutForWave(targetWaveNumber);
          console.log('[WAVE] applyFortressLayoutForWave done');
          this.applyPathLayoutForWave(targetWaveNumber, true);
          console.log('[WAVE] applyPathLayoutForWave done');
          this.updateHud();
          this.restoreHudAndTrayVisibility();
          this.updatePauseHudButton();
          console.log('[WAVE] restoreHudAndTrayVisibility done');

          if (this.startWaveButton) {
            this.startWaveButton.setFillStyle(0x164469, 0.98);
            this.startWaveButton.setStrokeStyle(2, 0x91ebff, 0.62);
            this.startWaveButton.setInteractive({ useHandCursor: true });
          }
          if (this.startWaveButtonLabel) {
            this.startWaveButtonLabel.setText('START WAVE ' + targetWaveNumber);
            this.startWaveButtonLabel.setColor('#f3fcff');
          }
          if (action === 'replay') {
            this.setStatus('Press START WAVE ' + targetWaveNumber + ' to replay.', '#9df8ff');
          } else {
            this.setStatus('Press START WAVE ' + targetWaveNumber + ' when ready.', '#9df8ff');
          }
          this.startWaveCountdown(8);
          console.log('[WAVE] startWaveCountdown done — wave ' + targetWaveNumber + ' ready');
        } catch (err) {
          console.error('[WAVE] proceedToNextWave ERROR:', err.message, err.stack);
          this.restoreHudAndTrayVisibility?.();
          this.updateHud?.();
        }
      };

      proceedToNextWave();
    });
  },

  showUpgradeModal: function (towers, onClose = () => {}) {
    const existing = document.getElementById('upgrade-modal-root');
    if (existing) existing.remove();

    let idx = 0;

    const root = document.createElement('div');
    root.id = 'upgrade-modal-root';
    root.style.cssText = [
      'position:fixed;inset:0;z-index:9999',
      'background:rgba(2,8,18,0.88)',
      'display:flex;flex-direction:column;align-items:center;justify-content:center',
      'padding:8px',
      'box-sizing:border-box',
      'overflow:auto',
      'font-family:"BlackOpsOne","Teko",sans-serif',
      'backdrop-filter:blur(3px)',
    ].join(';');

    root.innerHTML = `
      <style>
        #upgrade-modal-root .um-panel {
          background: linear-gradient(180deg,rgba(10,24,48,0.97),rgba(6,16,32,0.98));
          border: 2px solid rgba(95,210,255,0.55);
          border-radius: 16px;
          box-shadow: 0 0 0 1px rgba(95,210,255,0.18) inset, 0 12px 48px rgba(0,0,0,0.7);
          padding: 22px 26px 20px;
          min-width: 340px;
          max-width: 460px;
          width: 90vw;
          max-height: calc(100vh - 16px);
          overflow-y: auto;
          position: relative;
          color: #ddf4ff;
        }
        #upgrade-modal-root .um-eyebrow {
          font-size: 10px;
          letter-spacing: 2.5px;
          color: #5fd2ff;
          text-align: center;
          margin-bottom: 3px;
          text-transform: uppercase;
        }
        #upgrade-modal-root .um-title {
          font-size: 20px;
          font-weight: 800;
          letter-spacing: 1px;
          color: #91ebff;
          text-align: center;
          margin-bottom: 14px;
          text-transform: uppercase;
        }
        #upgrade-modal-root .um-body {
          display: flex;
          gap: 14px;
          margin-bottom: 14px;
        }
        #upgrade-modal-root .um-art {
          width: 100px;
          min-width: 100px;
          height: 100px;
          border: 1px solid rgba(95,210,255,0.3);
          border-radius: 10px;
          background: rgba(6,18,42,0.85) no-repeat center/contain;
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(95,210,255,0.3);
          font-size: 11px;
          text-align: center;
          font-family: 'Teko',sans-serif;
          letter-spacing: 0.5px;
          flex-shrink: 0;
        }
        #upgrade-modal-root .um-info { flex: 1; min-width: 0; }
        #upgrade-modal-root .um-name {
          font-size: 16px;
          font-weight: 700;
          color: #91ebff;
          margin-bottom: 2px;
          letter-spacing: 0.5px;
        }
        #upgrade-modal-root .um-level {
          font-size: 11px;
          color: rgba(160,215,240,0.6);
          margin-bottom: 10px;
          font-family: 'Teko',sans-serif;
          text-transform: uppercase;
          letter-spacing: 0.8px;
        }
        #upgrade-modal-root .um-stats { display: flex; flex-direction: column; gap: 5px; }
        #upgrade-modal-root .um-stat-row {
          display: grid;
          grid-template-columns: 68px 1fr auto;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-family: 'Teko',sans-serif;
        }
        #upgrade-modal-root .um-stat-label { color: rgba(160,215,240,0.65); }
        #upgrade-modal-root .um-bar-wrap {
          height: 5px;
          background: rgba(95,210,255,0.12);
          border-radius: 3px;
          overflow: hidden;
        }
        #upgrade-modal-root .um-bar-fill {
          height: 100%;
          border-radius: 3px;
          background: linear-gradient(90deg,#2fa4cf,#7af3ff);
          transition: width 0.3s;
        }
        #upgrade-modal-root .um-bar-fill.gain { background: linear-gradient(90deg,#3adf80,#9fffd4); }
        #upgrade-modal-root .um-stat-val { color: #ddf4ff; font-weight: 600; text-align: right; min-width: 36px; }
        #upgrade-modal-root .um-stat-gain { color: #7dffb8; font-size: 11px; }
        #upgrade-modal-root .um-cost-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(6,18,38,0.6);
          border: 1px solid rgba(95,210,255,0.2);
          border-radius: 8px;
          padding: 9px 14px;
          margin-bottom: 12px;
        }
        #upgrade-modal-root .um-cost-label { font-size: 12px; color: rgba(160,215,240,0.6); font-family:"Teko",sans-serif; text-transform:uppercase; letter-spacing:0.8px; }
        #upgrade-modal-root .um-cost-val { font-size: 16px; font-weight: 700; }
        #upgrade-modal-root .um-cost-val.can-afford { color: #ffd97a; }
        #upgrade-modal-root .um-cost-val.cant-afford { color: #ff8080; }
        #upgrade-modal-root .um-nav {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-bottom: 12px;
        }
        #upgrade-modal-root .um-nav-btn {
          background: rgba(10,30,58,0.9);
          border: 1px solid rgba(95,210,255,0.35);
          color: #91ebff;
          font-size: 18px;
          width: 32px; height: 32px;
          border-radius: 7px;
          cursor: pointer;
          line-height: 1;
        }
        #upgrade-modal-root .um-nav-btn:hover { background: rgba(95,210,255,0.15); }
        #upgrade-modal-root .um-counter { font-size: 12px; color: rgba(180,230,255,0.5); font-family:"Teko",sans-serif; min-width:40px; text-align:center; }
        #upgrade-modal-root .um-actions {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        #upgrade-modal-root .um-actions-secondary {
          display: flex;
          gap: 10px;
        }
        #upgrade-modal-root .um-btn-upgrade {
          width: 100%;
          padding: 11px 0;
          border-radius: 9px;
          font-size: 13px; font-weight: 700; letter-spacing: 0.8px;
          cursor: pointer; border: 2px solid; text-transform: uppercase;
          font-family: 'BlackOpsOne',"Teko",sans-serif;
        }
        #upgrade-modal-root .um-btn-upgrade.can-afford { background:linear-gradient(180deg,#1e7a4a,#145c37); border-color:#3adf80; color:#c8ffe0; }
        #upgrade-modal-root .um-btn-upgrade.cant-afford { background:rgba(40,10,10,0.8); border-color:#882222; color:#ff9090; cursor:not-allowed; opacity:0.7; }
        #upgrade-modal-root .um-btn-skip {
          flex: 1;
          padding: 11px 18px; border-radius: 9px; font-size: 12px; font-weight: 600;
          cursor: pointer; background: rgba(10,24,44,0.8); border: 1px solid rgba(95,210,255,0.22);
          color: rgba(180,230,255,0.6); text-transform: uppercase; letter-spacing: 0.5px;
          font-family: 'BlackOpsOne',"Teko",sans-serif;
        }
        #upgrade-modal-root .um-btn-skip:hover { background: rgba(95,210,255,0.1); }
        #upgrade-modal-root .um-btn-armory {
          flex: 1;
          padding: 11px 18px;
          border-radius: 9px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer; background: rgba(255,180,40,0.12); border: 1px solid rgba(255,180,40,0.4);
          color: #ffd97a; text-transform: uppercase; letter-spacing: 0.6px;
          font-family: 'BlackOpsOne',"Teko",sans-serif;
        }
        #upgrade-modal-root .um-btn-armory:hover { background: rgba(255,180,40,0.22); }
        @keyframes um-flash {
          0%   { box-shadow: 0 0 0 0 rgba(58,223,128,0); background: rgba(6,18,38,0.72); }
          25%  { box-shadow: 0 0 0 8px rgba(58,223,128,0.5); background: rgba(20,80,44,0.9); }
          100% { box-shadow: 0 0 0 0 rgba(58,223,128,0); background: rgba(6,18,38,0.72); }
        }
        @keyframes um-banner-in {
          0%   { opacity:0; transform: scale(0.6) translateY(-10px); }
          60%  { opacity:1; transform: scale(1.08) translateY(0); }
          100% { opacity:1; transform: scale(1) translateY(0); }
        }
        @keyframes um-banner-out {
          0%   { opacity:1; transform: scale(1); }
          100% { opacity:0; transform: scale(0.8) translateY(-8px); }
        }
        #upgrade-modal-root .um-upgraded-banner {
          display: none;
          position: absolute;
          inset: 0;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          pointer-events: none;
          z-index: 10;
        }
        #upgrade-modal-root .um-upgraded-banner.visible { display: flex; }
        #upgrade-modal-root .um-upgraded-pill {
          background: linear-gradient(135deg, #1e7a4a, #145c37);
          border: 2px solid #3adf80;
          border-radius: 12px;
          padding: 14px 28px;
          text-align: center;
          box-shadow: 0 0 32px rgba(58,223,128,0.5);
          animation: um-banner-in 0.35s cubic-bezier(0.22,1,0.36,1) forwards;
        }
        #upgrade-modal-root .um-upgraded-pill.out {
          animation: um-banner-out 0.25s ease-in forwards;
        }
        #upgrade-modal-root .um-upgraded-title {
          font-size: 20px; font-weight: 800; color: #c8ffe0;
          letter-spacing: 2px; text-transform: uppercase;
          font-family: 'BlackOpsOne',sans-serif;
          margin-bottom: 4px;
        }
        #upgrade-modal-root .um-upgraded-level {
          font-size: 14px; color: #7dffb8;
          font-family: 'BlackOpsOne',sans-serif; letter-spacing: 1px;
        }
        #upgrade-modal-root .um-confetti-layer {
          position: absolute; inset: 0;
          pointer-events: none; overflow: hidden; border-radius: 16px;
        }
        @keyframes um-confetti-fall {
          0%   { transform: translateY(-20px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(340px) rotate(720deg); opacity: 0; }
        }
        #upgrade-modal-root .um-panel { position: relative; overflow: hidden; }
        @media (max-width: 900px), (max-height: 520px) {
          #upgrade-modal-root {
            align-items: stretch;
            justify-content: flex-start;
          }
          #upgrade-modal-root .um-panel {
            width: min(96vw, 460px);
            min-width: 0;
            margin: auto;
            border-radius: 12px;
            padding: 14px 14px 12px;
            max-height: calc(100vh - 12px);
          }
          #upgrade-modal-root .um-eyebrow {
            font-size: 9px;
            letter-spacing: 2px;
            margin-bottom: 2px;
          }
          #upgrade-modal-root .um-title {
            font-size: 16px;
            margin-bottom: 10px;
          }
          #upgrade-modal-root .um-body {
            gap: 10px;
            margin-bottom: 10px;
          }
          #upgrade-modal-root .um-art {
            width: 72px;
            min-width: 72px;
            height: 72px;
          }
          #upgrade-modal-root .um-name {
            font-size: 13px;
          }
          #upgrade-modal-root .um-level {
            font-size: 10px;
            margin-bottom: 7px;
          }
          #upgrade-modal-root .um-stat-row {
            grid-template-columns: 54px 1fr auto;
            font-size: 10.5px;
            gap: 5px;
          }
          #upgrade-modal-root .um-cost-row {
            padding: 7px 10px;
            margin-bottom: 8px;
          }
          #upgrade-modal-root .um-cost-label {
            font-size: 10px;
          }
          #upgrade-modal-root .um-cost-val {
            font-size: 13px;
          }
          #upgrade-modal-root .um-nav {
            gap: 8px;
            margin-bottom: 8px;
          }
          #upgrade-modal-root .um-nav-btn {
            width: 28px;
            height: 28px;
            font-size: 16px;
          }
          #upgrade-modal-root .um-counter {
            font-size: 11px;
          }
          #upgrade-modal-root .um-actions {
            gap: 8px;
          }
          #upgrade-modal-root .um-actions-secondary {
            gap: 8px;
          }
          #upgrade-modal-root .um-btn-upgrade,
          #upgrade-modal-root .um-btn-skip,
          #upgrade-modal-root .um-btn-armory {
            padding: 9px 0;
            font-size: 11px;
          }
          #upgrade-modal-root .um-btn-skip {
            padding-left: 10px;
            padding-right: 10px;
          }
        }
        @media (max-height: 430px) {
          #upgrade-modal-root .um-eyebrow {
            display: none;
          }
          #upgrade-modal-root .um-title {
            font-size: 14px;
            margin-bottom: 6px;
          }
          #upgrade-modal-root .um-art {
            width: 64px;
            min-width: 64px;
            height: 64px;
          }
          #upgrade-modal-root .um-body {
            margin-bottom: 6px;
          }
        }
      </style>
      <div class="um-panel">
        <div class="um-confetti-layer" id="um-confetti"></div>
        <div class="um-upgraded-banner" id="um-banner">
          <div class="um-upgraded-pill" id="um-pill">
            <div class="um-upgraded-title">⬆ Upgraded!</div>
            <div class="um-upgraded-level" id="um-banner-level"></div>
          </div>
        </div>
        <div class="um-eyebrow">Between Waves</div>
        <div class="um-title">Upgrade Turrets</div>
        <div class="um-body">
          <div class="um-art" id="um-art"></div>
          <div class="um-info">
            <div class="um-name" id="um-name"></div>
            <div class="um-level" id="um-level"></div>
            <div class="um-stats" id="um-stats"></div>
          </div>
        </div>
        <div class="um-cost-row">
          <span class="um-cost-label">Upgrade Cost</span>
          <span class="um-cost-val" id="um-cost-val"></span>
        </div>
        <div class="um-nav">
          <button class="um-nav-btn" id="um-prev">‹</button>
          <span class="um-counter" id="um-counter"></span>
          <button class="um-nav-btn" id="um-next">›</button>
        </div>
        <div class="um-actions">
          <button class="um-btn-upgrade" id="um-upgrade"></button>
          <div class="um-actions-secondary">
            <button class="um-btn-armory" id="um-armory">Armory</button>
            <button class="um-btn-skip" id="um-skip">skip all</button>
          </div>
        </div>
      </div>
    `;

    const artEl    = root.querySelector('#um-art');
    const nameEl   = root.querySelector('#um-name');
    const levelEl  = root.querySelector('#um-level');
    const statsEl  = root.querySelector('#um-stats');
    const costVal  = root.querySelector('#um-cost-val');
    const counter  = root.querySelector('#um-counter');
    const prevBtn  = root.querySelector('#um-prev');
    const nextBtn  = root.querySelector('#um-next');
    const upgradeBtn = root.querySelector('#um-upgrade');
    const skipBtn  = root.querySelector('#um-skip');
    const armoryBtn = root.querySelector('#um-armory');
    const banner   = root.querySelector('#um-banner');
    const pill     = root.querySelector('#um-pill');
    const bannerLevel = root.querySelector('#um-banner-level');
    const confettiLayer = root.querySelector('#um-confetti');
    const bodyEl   = root.querySelector('.um-body');

    const CONFETTI_COLORS = ['#3adf80','#91ebff','#ffd97a','#ff8fc8','#c8a0ff','#7dffb8'];
    const spawnConfetti = () => {
      confettiLayer.innerHTML = '';
      for (let i = 0; i < 32; i++) {
        const el = document.createElement('div');
        const size = 6 + Math.random() * 8;
        const color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
        const left = Math.random() * 100;
        const delay = Math.random() * 0.4;
        const dur = 0.8 + Math.random() * 0.6;
        const isRect = Math.random() > 0.5;
        el.style.cssText = `position:absolute;left:${left}%;top:0;width:${isRect ? size * 0.5 : size}px;height:${size}px;background:${color};border-radius:${isRect ? '2px' : '50%'};animation:um-confetti-fall ${dur}s ${delay}s ease-in forwards;`;
        confettiLayer.appendChild(el);
      }
    };

    const showUpgradedBanner = (newLevel) => {
      bannerLevel.textContent = 'Now Level ' + newLevel;
      pill.classList.remove('out');
      void pill.offsetWidth;
      banner.classList.add('visible');
      if (bodyEl) { bodyEl.style.animation = 'um-flash 0.5s ease-out'; void bodyEl.offsetWidth; }
      spawnConfetti();
      window.setTimeout(() => {
        pill.classList.add('out');
        window.setTimeout(() => { banner.classList.remove('visible'); confettiLayer.innerHTML = ''; if (bodyEl) bodyEl.style.animation = ''; }, 280);
      }, 1400);
    };

    const statBar = (label, cur, next, maxVal) => {
      const nextPct = Math.min(100, (next / maxVal) * 100).toFixed(1);
      const gainPct = cur > 0 ? (((next - cur) / cur) * 100).toFixed(0) : '0';
      return `<div class="um-stat-row">
        <span class="um-stat-label">${label}</span>
        <div class="um-bar-wrap"><div class="um-bar-fill gain" style="width:${nextPct}%"></div></div>
        <span class="um-stat-val">${Number(next).toFixed(next < 10 ? 2 : 0)} <span class="um-stat-gain">+${gainPct}%</span></span>
      </div>`;
    };

    // towers is now an array of weapon defs (catalog entries), not placed tower instances
    // idx navigates between defs; upgrades persist in gameState.weaponUpgradeLevels
    const getDefLevel = (def) => (this.gameState?.weaponUpgradeLevels?.[def.key] || 1);
    const getDefCost  = (def) => {
      const base = Math.max(20, def.cost || 30);
      return Math.round(base * (0.85 + getDefLevel(def) * 0.65));
    };

    const render = () => {
      const def   = towers[idx];
      const level = getDefLevel(def);
      const cost  = getDefCost(def);
      const canAfford = (this.gameState?.gold || 0) >= cost;

      // Stats at current upgrade level and next level
      const applyLevels = (base, mult, levels) => base * Math.pow(mult, levels - 1);
      const curDmg = applyLevels(def.damage || 1,   1.3, level);
      const curRng = applyLevels(def.range  || 200, 1.06, level);
      const curFr  = applyLevels(def.fireRate|| 400, 0.88, level);

      const imageSrc = this.getWaveTransitionWeaponImageSrc?.({ textureKey: def.textureKey || def.key }) || '';
      const assetPath = String(def.assetPath || '').trim();
      const fallbackSrc = assetPath ? ('/' + assetPath) : '';
      const previewSrc = imageSrc || fallbackSrc;
      if (previewSrc) {
        artEl.style.backgroundImage = 'url(' + previewSrc + ')';
        artEl.style.backgroundSize = imageSrc ? 'contain' : 'auto 100%';
        artEl.style.backgroundPosition = imageSrc ? 'center' : '0 0';
        artEl.textContent = '';
      } else {
        artEl.style.backgroundImage = 'none';
        artEl.style.backgroundSize = '';
        artEl.style.backgroundPosition = '';
        artEl.textContent = 'No Preview';
      }

      nameEl.textContent  = def.name || 'Weapon';
      levelEl.textContent = 'Level ' + level + ' → ' + (level + 1);
      counter.textContent = (idx + 1) + ' / ' + towers.length;

      costVal.textContent = cost + ' gold';
      costVal.className   = 'um-cost-val ' + (canAfford ? 'can-afford' : 'cant-afford');

      statsEl.innerHTML = [
        statBar('Damage',    curDmg, curDmg * 1.3, 800),
        statBar('Range',     curRng, curRng * 1.06, 600),
        statBar('Fire Rate', 1000 / curFr, 1000 / Math.max(90, Math.round(curFr * 0.88)), 12),
      ].join('');

      upgradeBtn.textContent = canAfford ? 'Upgrade (' + cost + 'g)' : 'Not enough gold';
      upgradeBtn.className   = 'um-btn-upgrade ' + (canAfford ? 'can-afford' : 'cant-afford');
      upgradeBtn.disabled    = !canAfford;
    };

    prevBtn.onclick = () => { idx = (idx - 1 + towers.length) % towers.length; render(); };
    nextBtn.onclick = () => { idx = (idx + 1) % towers.length; render(); };

    const close = () => { root.remove(); document.removeEventListener('keydown', onKey); onClose?.(); };
    const onKey = (e) => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', onKey);
    root.addEventListener('click', (e) => { if (e.target === root) close(); });

    upgradeBtn.onclick = () => {
      try {
        const def  = towers[idx];
        const cost = getDefCost(def);
        if ((this.gameState?.gold || 0) >= cost) {
          this.gameState.gold -= cost;
          if (!this.gameState.weaponUpgradeLevels) this.gameState.weaponUpgradeLevels = {};
          const prevLevel = getDefLevel(def);
          const nextLevel = prevLevel + 1;
          this.gameState.weaponUpgradeLevels[def.key] = nextLevel;

          // Keep the catalog entry in sync so tray labels and detail panels
          // immediately reflect the newly upgraded tier.
          def.blueprintTier = nextLevel;
          def.blueprintPreviewTier = nextLevel;
          def.damage = (def.damage || 1) * 1.3;
          def.baseDamage = def.damage;
          def.range = (def.range || 200) * 1.06;
          def.fireRate = Math.max(90, Math.round((def.fireRate || 400) * 0.88));
          def.powerTierLabel = this.getWeaponPowerTierInfo?.(def.baseDamage || def.damage || 0)?.label || def.powerTierLabel;

          if (!(this.blueprintWeaponRuntimeStateByName instanceof Map)) {
            this.blueprintWeaponRuntimeStateByName = new Map();
          }
          const existingBlueprintState = this.blueprintWeaponRuntimeStateByName.get(def.name) || {};
          this.blueprintWeaponRuntimeStateByName.set(def.name, {
            ...existingBlueprintState,
            tier: nextLevel,
            turretMk: Math.max(1, Number(existingBlueprintState.turretMk) || 1),
            previewTier: nextLevel,
            stats: {
              ...(existingBlueprintState.stats || {}),
              damage: def.baseDamage || def.damage || 0,
              range: ((Number(def.range) || 0) / TOWER_RANGE) * BLUEPRINT_RANGE_UI_FACTOR,
              fireRate: 1000 / Math.max(1, Number(def.fireRate) || 1),
              health: Math.max(1, TOWER_MAX_HEALTH + Number(def.moduleIntegrity || 0)),
            },
          });
          this.persistBlueprintRuntimeState?.();

          // Propagate to any currently placed towers of this weapon type
          (this.towers?.children?.entries || []).forEach(t => {
            if (!t?.active) return;
            if ((t.getData('sourceTowerDef') || {}).key !== def.key) return;
            t.setData('upgradeLevel', nextLevel);
            t.setData('damage',   (t.getData('damage')   || 1)   * 1.3);
            t.setData('range',    (t.getData('range')    || 200) * 1.06);
            t.setData('fireRate', Math.max(90, Math.round((t.getData('fireRate') || 400) * 0.88)));
            t.setData('armorPen', (t.getData('armorPen') || 0)   + 0.25);
          });
          this.updateHud?.();
          this.renderWeaponCarousel?.();
          this.refreshSelectedPlacedTowerDetails?.();
          if (this.selectedTowerDef?.key === def.key) {
            this.selectTowerDef(def, !!this.selectedPlacedTower);
          }
          showUpgradedBanner(nextLevel);
          window.setTimeout(() => {
            const cap = this.getTowerUpgradeCapForPlayerLevel();
            towers = towers.filter(d => (this.gameState?.weaponUpgradeLevels?.[d.key] || 1) < cap);
            if (towers.length === 0) { close(); return; }
            idx = Math.min(idx, towers.length - 1);
            render();
          }, 1700);
        }
      } catch (err) { close(); }
    };

    skipBtn.onclick = close;
    armoryBtn.onclick = () => {
      close();
      if (typeof window.__toggleBlueprintOverlay === 'function') {
        window.__toggleBlueprintOverlay(true);
      } else {
        this.toggleBlueprintOverlay?.(true);
      }
    };
    document.body.appendChild(root);
    render();
  },

  clearPlacedTowersForNextWave: function () {
    const placedTowers = this.towers?.children?.entries ? this.towers.children.entries.slice() : [];
    placedTowers.forEach((tower) => {
      if (tower?.active) {
        this.destroyTower(tower);
      }
    });
    this.draggingFromTray = false;
    this.activeTrayTowerDef = null;
  },

  showWaveTransitionSplash: function (summaryOrNextWaveNumber, onComplete) {
    const summary = typeof summaryOrNextWaveNumber === 'object' && summaryOrNextWaveNumber
      ? summaryOrNextWaveNumber
      : {
        completedWave: Math.max(0, Number((summaryOrNextWaveNumber || 1) - 1)),
        nextWaveNumber: Math.max(1, Number(summaryOrNextWaveNumber || 1)),
        worldCleared: false,
        rewards: {
          supplies: Math.max(0, Number(this.waveSuppliesEarned || 0)),
          gold: Math.max(0, Number(this.lastWaveCompletionGoldBonus || 0)),
          xp: COMMANDER_XP_PER_WAVE,
        },
        stats: {
          enemiesDestroyed: Math.max(0, Number(this.enemiesDefeated || 0)),
          damageDealt: Math.max(0, Math.round(Number(this.waveDamageDealt || 0))),
          towersRemaining: String(this.towers?.children?.entries?.filter((tower) => tower?.active).length || 0),
          timeTaken: this.formatWaveTransitionDuration(Math.max(0, ((this.time?.now || 0) - Number(this.waveStartedAtMs || 0)))),
        },
      };

    const renderPhaserSplash = () => {
    if (this.waveTransitionSplash) {
      this.waveTransitionSplash.destroy(true);
      this.waveTransitionSplash = null;
    }
    this.clearWaveTransitionConfetti();

    const splashLayer = this.add.container(0, 0).setDepth(60);
    const backdrop = this.add.rectangle(BOARD_WIDTH * 0.5, BOARD_HEIGHT * 0.5, BOARD_WIDTH, BOARD_HEIGHT, 0x050a14, 0.9)
      .setInteractive();

    const panelWidth = Math.min(sx(720), BOARD_WIDTH - sx(60));
    const panelHeight = sy(290);
    const panelX = (BOARD_WIDTH - panelWidth) * 0.5;
    const panelY = (BOARD_HEIGHT - panelHeight) * 0.5;
    const panelCenterX = panelX + panelWidth * 0.5;
    const panelCenterY = panelY + panelHeight * 0.5;

    const panel = this.add.graphics();
    panel.fillStyle(0x0b1728, 0.96);
    panel.lineStyle(3, 0x70d7ff, 0.54);
    panel.fillRoundedRect(panelX, panelY, panelWidth, panelHeight, sx(26));
    panel.strokeRoundedRect(panelX, panelY, panelWidth, panelHeight, sx(26));

    const heading = this.add.text(panelCenterX, panelY + sy(56), summary.worldCleared ? 'WORLD CLEARED' : 'WAVE CLEARED', {
      fontFamily: 'Trebuchet MS',
      fontSize: '34px',
      color: '#dff6ff',
      fontStyle: 'bold',
      letterSpacing: 2,
    }).setOrigin(0.5);

    const message = this.add.text(panelCenterX, panelY + sy(118), summary.worldCleared ? 'SECTOR SECURED' : ('GET READY FOR WAVE ' + summary.nextWaveNumber), {
      fontFamily: 'Trebuchet MS',
      fontSize: '42px',
      color: '#8ff3c4',
      fontStyle: 'bold',
      letterSpacing: 1,
      align: 'center',
    }).setOrigin(0.5);

    const subMessage = this.add.text(panelCenterX, panelY + sy(168), summary.worldCleared ? 'Choose your next move from the command console.' : 'Re-arm your defense line and prepare for heavier pressure.', {
      fontFamily: 'Trebuchet MS',
      fontSize: '20px',
      color: '#9dd3e8',
      align: 'center',
    }).setOrigin(0.5);

    const continueButton = this.add.rectangle(panelCenterX, panelY + sy(228), sx(216), sy(38), 0x164469, 0.98)
      .setStrokeStyle(2, 0x91ebff, 0.75)
      .setInteractive({ useHandCursor: true });
    const continueLabel = this.add.text(panelCenterX, panelY + sy(228), 'CONTINUE', {
      fontFamily: 'Trebuchet MS',
      fontSize: '18px',
      color: '#f3fcff',
      fontStyle: 'bold',
      letterSpacing: 1,
    }).setOrigin(0.5);

    splashLayer.add([
      backdrop,
      panel,
      heading,
      message,
      subMessage,
      continueButton,
      continueLabel,
    ]);

    this.waveTransitionSplash = splashLayer;
    if (!this.gameState?.gameOver) {
      this.stopAllActiveGameAudio();
      this.launchWaveTransitionConfetti();
      this.playWaveWinSfx(1, 0.92);
    }

    let resolved = false;
    const closeSplash = () => {
      if (resolved) {
        return;
      }
      resolved = true;
      this.clearWaveTransitionConfetti();

      if (this.waveTransitionSplash) {
        this.waveTransitionSplash.destroy(true);
        this.waveTransitionSplash = null;
      }

      if (onComplete) {
        onComplete('continue');
      }
    };

    continueButton.on('pointerdown', closeSplash);
    };

    if (typeof document !== 'undefined') {
      this.showHtmlWaveTransitionSplash(summary, onComplete).then((shown) => {
        if (!shown) {
          renderPhaserSplash();
        }
      });
      return;
    }

    renderPhaserSplash();
  },

  clearWaveTransitionConfetti: function () {
    if (this.htmlWaveClearElements?.confetti) {
      this.htmlWaveClearElements.confetti.innerHTML = '';
    }

    if (!this.waveTransitionConfettiFx) {
      return;
    }

    const fx = this.waveTransitionConfettiFx;
    if (fx.htmlCleanupTimer) {
      clearTimeout(fx.htmlCleanupTimer);
    }
    if (fx.stopTimer) {
      fx.stopTimer.remove(false);
    }
    if (fx.cleanupTimer) {
      fx.cleanupTimer.remove(false);
    }
    if (Array.isArray(fx.emitters)) {
      fx.emitters.forEach((emitter) => {
        if (emitter && emitter.destroy) {
          emitter.destroy();
        }
      });
    }
    this.waveTransitionConfettiFx = null;
  },

  launchWaveTransitionConfetti: function () {
    this.clearWaveTransitionConfetti();

    if (this.htmlWaveClearOverlayNode && this.htmlWaveClearOverlayNode.style.display !== 'none' && this.htmlWaveClearElements?.confetti) {
      const confettiRoot = this.htmlWaveClearElements.confetti;
      const colors = ['#66e3ff', '#7fffd4', '#ffe66b', '#ff8ab5', '#ffffff', '#9cc8ff'];
      const pieces = [];
      const total = 76;

      for (let i = 0; i < total; i += 1) {
        const piece = document.createElement('span');
        const fromLeft = i < total / 2;
        const baseX = fromLeft ? (90 + Math.random() * 250) : (1260 + Math.random() * 250);
        const driftX = fromLeft ? (140 + Math.random() * 220) : (-140 - Math.random() * 220);
        const fallDistance = 840 + Math.random() * 260;
        const duration = 2400 + Math.random() * 1800;
        const delay = Math.random() * 700;
        const width = 8 + Math.random() * 7;
        const height = 14 + Math.random() * 18;
        const color = colors[i % colors.length];
        const spin = (Math.random() > 0.5 ? 1 : -1) * (220 + Math.random() * 540);

        piece.className = 'wc-confetti';
        piece.style.left = Math.round(baseX) + 'px';
        piece.style.width = Math.round(width) + 'px';
        piece.style.height = Math.round(height) + 'px';
        piece.style.color = color;
        piece.style.background = color;
        piece.style.animationDuration = duration + 'ms';
        piece.style.animationDelay = delay + 'ms';
        piece.style.setProperty('--drift-x', Math.round(driftX) + 'px');
        piece.style.setProperty('--fall-distance', Math.round(fallDistance) + 'px');
        piece.style.setProperty('--spin', Math.round(spin) + 'deg');
        confettiRoot.appendChild(piece);
        pieces.push(piece);
      }

      const htmlCleanupTimer = setTimeout(() => {
        this.clearWaveTransitionConfetti();
      }, 6200);

      this.waveTransitionConfettiFx = {
        htmlCleanupTimer,
        htmlPieces: pieces,
      };
      return;
    }

    const emitters = [];
    const makeEmitter = (texture, config) => {
      const emitter = this.add.particles(0, 0, texture, config).setDepth(78);
      emitters.push(emitter);
      return emitter;
    };

    const shared = {
      lifespan: { min: 1100, max: 1700 },
      speed: { min: sy(260), max: sy(520) },
      gravityY: sy(520),
      rotate: { min: -220, max: 220 },
      quantity: 7,
      frequency: 42,
      scale: { start: 1.25, end: 0.55 },
      alpha: { start: 0.98, end: 0 },
      tint: [0x66e3ff, 0x7fffd4, 0xffe56b, 0xff86a6, 0xffffff],
    };

    const left = makeEmitter('trailBallistic', {
      ...shared,
      x: { min: sx(86), max: sx(170) },
      y: { min: sy(62), max: sy(120) },
      angle: { min: 24, max: 72 },
    });

    const right = makeEmitter('trailBallistic', {
      ...shared,
      x: { min: BOARD_WIDTH - sx(170), max: BOARD_WIDTH - sx(86) },
      y: { min: sy(62), max: sy(120) },
      angle: { min: 108, max: 156 },
    });

    const top = makeEmitter('enemyProjectile', {
      lifespan: { min: 900, max: 1400 },
      speed: { min: sy(140), max: sy(260) },
      gravityY: sy(460),
      rotate: { min: -120, max: 120 },
      quantity: 4,
      frequency: 58,
      scale: { start: 1.1, end: 0.6 },
      alpha: { start: 0.86, end: 0 },
      tint: [0xffb1c9, 0xfce6ff, 0xcdf5ff, 0xffffff],
      x: { min: BOARD_WIDTH * 0.34, max: BOARD_WIDTH * 0.66 },
      y: { min: sy(40), max: sy(70) },
      angle: { min: 82, max: 98 },
    });

    const stopTimer = this.time.delayedCall(1400, () => {
      left.stop();
      right.stop();
      top.stop();
    });

    const cleanupTimer = this.time.delayedCall(2900, () => {
      this.clearWaveTransitionConfetti();
    });

    this.waveTransitionConfettiFx = {
      emitters,
      stopTimer,
      cleanupTimer,
    };
  },

  restoreHudAndTrayVisibility: function () {
    // Phaser tray elements to skip when HTML tray is rendering them
    const htmlTrayActive = !!this.useHtmlWeaponTray;
    const phaserTraySet = new Set(htmlTrayActive ? [
      this.trayBackground, this.weaponPreviewHalo, this.weaponPreviewRing,
      this.weaponDetailImage, this.weaponDetailBadge, this.weaponDetailTitle,
      this.weaponDetailRole, this.weaponDetailStats, this.weaponDetailPanel,
      this.weaponDetailFlavor, this.weaponInfoText, this.weaponCarouselPrev,
      this.weaponCarouselNext, this.startWaveButton, this.startWaveButtonLabel,
      ...((this.weaponHudCards || []).flatMap((e) => [e.card, e.image, e.numberLabel])),
    ].filter(Boolean) : []);

    const alwaysVisibleObjects = [
      // hudPanel excluded — controlled by setPhaserTopHudVisible
      ...(this.hudStaticTexts || []),
      this.goldText,
      this.livesText,
      this.waveText,
      this.playerLevelText,
      this.scoreText,
      this.statusText,
      this.trayBackground,
      this.weaponPreviewHalo,
      this.weaponPreviewRing,
      this.weaponDetailImage,
      this.weaponPreviewLabel,
      this.weaponDetailBadge,
      this.weaponDetailTitle,
      this.weaponDetailRole,
      this.weaponDetailStats,
      this.upgradeTowerButton,
      this.upgradeTowerButtonLabel,
      this.weaponCarouselPrev,
      this.weaponCarouselNext,
      this.startWaveButton,
      this.startWaveButtonLabel,
      this.blueprintChevronButton,
      this.blueprintChevronLabel,
      ...((this.weaponHudCards || []).flatMap((entry) => [entry.card, entry.image, entry.numberLabel])),
    ].filter(Boolean);

    alwaysVisibleObjects.forEach((obj) => {
      if (!obj || !obj.active) {
        return;
      }
      if (phaserTraySet.has(obj)) {
        obj.setVisible(false);
        obj.setAlpha(0);
        return;
      }
      obj.setVisible(true);
      if (obj === this.blueprintChevronButton || obj === this.blueprintChevronLabel) {
        obj.setAlpha(1);
      }
    });

    const gameplayOverlayObjects = [
      this.weaponReachGlowLayer,
      this.previewTower,
      this.previewTowerLabel,
      this.fireDebugOverlayText,
    ];

    gameplayOverlayObjects.forEach((obj) => {
      if (!obj || !obj.active) {
        return;
      }
      if (typeof obj.setDepth === 'function' && obj.depth < 20) {
        obj.setDepth(20);
      }
    });

    if (this.useHtmlHudOverlay) {
      this.setPhaserTopHudVisible(false);
      this.setupHtmlHudOverlay();
    }

    if (this.useHtmlWeaponTray) {
      this.setupHtmlWeaponTray();
    }

    if (this.useBlueprintOverlay) {
      this.setupBlueprintOverlay();
    }
  },

  repairTowersBetweenWaves: function () {
    this.towers.children.entries.forEach((tower) => {
      if (!tower?.active) {
        return;
      }
      const maxHealth = Math.max(1, tower.getData('maxHealth') || TOWER_MAX_HEALTH);
      tower.setData('health', maxHealth);
      this.syncTowerHealthVisual(tower);
    });
  },

  updateHud: function () {
    const isAttackRole = this.gameState?.selectedMode === 'multiplayer'
      && this.gameState?.multiplayerRole === 'enemyCommander';
    const commanderName = this.getCommanderDisplayName ? this.getCommanderDisplayName() : (this.loadCommanderData?.().name || 'Commander');
    const displayCurrency = isAttackRole
      ? Math.round(Math.max(0, Number(this.multiplayerRuntime?.threat || 0)))
      : (isFinite(this.gameState?.gold) ? this.gameState.gold : 0);
    if (this.hudCommanderNameText) {
      this.hudCommanderNameText.setText(commanderName);
    }
    this.goldText.setText(String(displayCurrency));
    this.livesText.setText(String(this.gameState.lives));
    this.waveText.setText(String(this.gameState.wave));
    if (this.playerLevelText) {
      this.playerLevelText.setText(String(this.getEffectivePlayerLevel()));
    }
    this.scoreText.setText('SCORE  ' + this.gameState.score);

    if (this.updateTerrainThemeAssets()) {
      this.drawBackdrop();
      this.drawPath();
      this.drawTowerBases();
    }

    this.refreshSelectedPlacedTowerDetails();
    this.restoreHudAndTrayVisibility();
    this.updateHtmlHudValues();
    this.syncMultiplayerCommanderVisibility?.();
    this.updateMultiplayerCommanderHud?.();
    // Refresh range ring color whenever gold changes (red = can't afford)
    if (this.gameState?.prepPhase) {
      this.updateWeaponReachGlow();
    }
  },

  setStatus: function (message, color) {
    this.statusText.setText(message);
    this.statusText.setColor(color || '#9ad8ee');
    this.updateHtmlHudValues(true);
    this.updateMultiplayerCommanderHud?.(true);
  },

  getThemeMusicVolume: function (mode = 'battle') {
    const musicBus = this.getAudioBusLevel('music');
    const modeScale = mode === 'settings' ? 0.76 : 0.88;
    return Phaser.Math.Clamp(musicBus * modeScale, 0, 1);
  },

  syncThemeMusicVolumes: function () {
    const battleVolume = this.getThemeMusicVolume('battle');
    const settingsVolume = this.getThemeMusicVolume('settings');
    if (this.battleThemeMusic) {
      this.battleThemeMusic.setVolume(battleVolume);
    }
    if (this.settingsThemeMusic) {
      this.settingsThemeMusic.setVolume(settingsVolume);
    }
    if (this.tankEngineLoop?.isPlaying) {
      this.tankEngineLoop.setVolume(Phaser.Math.Clamp(this.getConfiguredAudioVolume('other', 0.62), 0, 1));
    }
  },

  stopThemeMusic: function () {
    this.sound?.stopByKey?.(BATTLE_THEME_AUDIO_KEY);
    this.sound?.stopByKey?.(SETTINGS_THEME_AUDIO_KEY);
    if (this.battleThemeMusic?.isPlaying) {
      this.battleThemeMusic.stop();
    }
    if (this.settingsThemeMusic?.isPlaying) {
      this.settingsThemeMusic.stop();
    }
    this.activeThemeMusicMode = 'none';
  },

  playBattleThemeMusic: function () {
    if (this.gameState?.gameOver) {
      return;
    }
    this.ensureAudioReady(false);

    if (!this.battleThemeMusic) {
      this.battleThemeMusic = this.sound.add(BATTLE_THEME_AUDIO_KEY, {
        loop: true,
        volume: 0,
      });
    }
    this.sound?.stopByKey?.(SETTINGS_THEME_AUDIO_KEY);
    this.sound?.stopByKey?.(BATTLE_THEME_AUDIO_KEY);
    if (this.settingsThemeMusic?.isPlaying) {
      this.settingsThemeMusic.stop();
    }
    const battleVolume = this.getThemeMusicVolume('battle');
    this.battleThemeMusic.setVolume(battleVolume);
    if (!this.battleThemeMusic.isPlaying) {
      this.battleThemeMusic.play({
        loop: true,
        volume: battleVolume,
      });
    }
    this.battleThemeMusic.setVolume(battleVolume);
    this.activeThemeMusicMode = 'battle';
  },

  playSettingsThemeMusic: function () {
    if (this.gameState?.gameOver) {
      return;
    }
    this.ensureAudioReady(false);

    if (!this.settingsThemeMusic) {
      this.settingsThemeMusic = this.sound.add(SETTINGS_THEME_AUDIO_KEY, {
        loop: true,
        volume: 0,
      });
    }
    this.sound?.stopByKey?.(BATTLE_THEME_AUDIO_KEY);
    this.sound?.stopByKey?.(SETTINGS_THEME_AUDIO_KEY);
    if (this.battleThemeMusic?.isPlaying) {
      this.battleThemeMusic.stop();
    }
    const settingsVolume = this.getThemeMusicVolume('settings');
    this.settingsThemeMusic.setVolume(settingsVolume);
    if (!this.settingsThemeMusic.isPlaying) {
      this.settingsThemeMusic.play({
        loop: true,
        volume: settingsVolume,
      });
    }
    this.settingsThemeMusic.setVolume(settingsVolume);
    this.activeThemeMusicMode = 'settings';
  },

  endGame: function () {
    return endGameSystem.call(this);
  },

  update: function () {
    return updateSystem.call(this);
  },

  shouldEnableWorldOneSmoke: function () {
    return false;
  },

  getWorldOneAtmosphereProfile: function (waveNumber) {
    const wave = Math.max(1, waveNumber || 1);
    const cycleIndex = (wave - 1) % WORLD_ONE_ATMOSPHERE_BY_WAVE.length;
    const profile = WORLD_ONE_ATMOSPHERE_BY_WAVE[cycleIndex] || WORLD_ONE_ATMOSPHERE_BY_WAVE[0];
    const cycleBoost = Math.floor((wave - 1) / WORLD_ONE_ATMOSPHERE_BY_WAVE.length);

    if (!cycleBoost) {
      return {
        ...profile,
        wave,
      };
    }

    const densityBoost = Math.min(1.42, 1 + cycleBoost * 0.06);
    const driftBoost = Math.min(1.38, 1 + cycleBoost * 0.05);

    return {
      ...profile,
      wave,
      overlayOpacity: Math.min(0.99, profile.overlayOpacity + cycleBoost * 0.006),
      spriteCount: Math.round(profile.spriteCount * densityBoost),
      opacityMin: Math.min(0.24, profile.opacityMin * densityBoost),
      opacityMax: Math.min(0.16, profile.opacityMax * densityBoost),
      driftXMin: profile.driftXMin * driftBoost,
      driftXMax: profile.driftXMax * driftBoost,
      driftYMin: profile.driftYMin * driftBoost,
      driftYMax: profile.driftYMax * driftBoost,
      windBase: profile.windBase * driftBoost,
      windSwing: profile.windSwing * driftBoost,
      windY: profile.windY * driftBoost,
      swayAmp: profile.swayAmp * driftBoost,
      swirlAmp: profile.swirlAmp * driftBoost,
    };
  },

  applyWaveAtmosphereProfile: function (waveNumber, immediate = false) {
    if (!this.shouldEnableWorldOneSmoke()) {
      return;
    }

    const profile = this.getWorldOneAtmosphereProfile(waveNumber);
    this.worldOneAtmosphereKey = profile.key + '-w' + profile.wave;

    if (immediate || !this.worldOneAtmosphereCurrent) {
      this.worldOneAtmosphereCurrent = { ...profile };
      this.worldOneAtmosphereTarget = { ...profile };
      this.worldOneAtmosphereLerp = null;
      this.worldOneAtmosphereConfig = this.worldOneAtmosphereCurrent;
      if (this.worldOneSmokeRenderer) {
        this.rebuildWorldOneSmokeSprites(this.worldOneAtmosphereCurrent);
        this.syncWorldOneSmokeBounds();
      }
      if (this.worldOneSmokeRoot) {
        this.worldOneSmokeRoot.style.opacity = String(profile.overlayOpacity);
      }
      if (this.worldOneSmokeRenderer?.domElement) {
        this.worldOneSmokeRenderer.domElement.style.mixBlendMode = profile.blendMode || 'normal';
      }
      return;
    }

    this.worldOneAtmosphereTarget = { ...profile };
    this.worldOneAtmosphereLerp = {
      start: { ...(this.worldOneAtmosphereCurrent || profile) },
      target: { ...profile },
      elapsed: 0,
      duration: 1700,
    };
  },

  rebuildWorldOneSmokeSprites: function (profile) {
    if (!this.worldOneSmokeScene) {
      return;
    }

    const cfg = profile || this.worldOneAtmosphereCurrent || this.worldOneAtmosphereConfig;
    if (!cfg) {
      return;
    }

    this.worldOneSmokeSprites.forEach((sprite) => {
      if (sprite?.parent) {
        sprite.parent.remove(sprite);
      }
      if (sprite?.material) {
        sprite.material.dispose?.();
      }
    });
    this.worldOneSmokeSprites = [];

    const textureCanvas = document.createElement('canvas');
    textureCanvas.width = 192;
    textureCanvas.height = 192;
    const ctx = textureCanvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, textureCanvas.width, textureCanvas.height);

      // Build an irregular cloud stamp with layered soft blobs (no bright center hotspot).
      for (let i = 0; i < 16; i += 1) {
        const cx = 56 + Math.random() * 80;
        const cy = 56 + Math.random() * 80;
        const inner = 3 + Math.random() * 10;
        const outer = 28 + Math.random() * 46;
        const gradient = ctx.createRadialGradient(cx, cy, inner, cx, cy, outer);
        const alpha = 0.06 + Math.random() * 0.12;
        gradient.addColorStop(0, 'rgba(210, 226, 238, ' + (alpha + 0.04).toFixed(3) + ')');
        gradient.addColorStop(0.55, 'rgba(164, 184, 200, ' + alpha.toFixed(3) + ')');
        gradient.addColorStop(1, 'rgba(122, 142, 160, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(cx - outer, cy - outer, outer * 2, outer * 2);
      }

      // Light grain pass to break up circular edges.
      const img = ctx.getImageData(0, 0, textureCanvas.width, textureCanvas.height);
      for (let i = 0; i < img.data.length; i += 4) {
        const noise = (Math.random() - 0.5) * 20;
        img.data[i + 3] = Math.max(0, Math.min(255, img.data[i + 3] + noise));
      }
      ctx.putImageData(img, 0, 0);
    }
    const smokeTexture = new THREE.CanvasTexture(textureCanvas);
    smokeTexture.needsUpdate = true;

    const spriteCount = Math.max(8, Math.floor(cfg.spriteCount || 18));
    for (let i = 0; i < spriteCount; i += 1) {
      const material = new THREE.SpriteMaterial({
        map: smokeTexture,
        transparent: true,
        opacity: Phaser.Math.Clamp(Phaser.Math.FloatBetween(cfg.opacityMin, cfg.opacityMax) * 0.56, 0.018, 0.09),
        depthWrite: false,
        depthTest: false,
        blending: THREE.NormalBlending,
        color: 0xc6d4df,
      });
      const sprite = new THREE.Sprite(material);
      const baseScale = Phaser.Math.FloatBetween(cfg.scaleMin * 0.6, cfg.scaleMax * 0.74);
      sprite.scale.set(baseScale, baseScale, 1);
      sprite.userData = {
        baseScale,
        driftX: Phaser.Math.FloatBetween(cfg.driftXMin, cfg.driftXMax),
        driftY: Phaser.Math.FloatBetween(cfg.driftYMin, cfg.driftYMax),
        phase: Math.random() * Math.PI * 2,
        baseOpacity: material.opacity,
      };
      this.worldOneSmokeScene.add(sprite);
      this.worldOneSmokeSprites.push(sprite);
    }
  },

  stepWorldOneAtmosphereTransition: function (deltaMs) {
    if (!this.worldOneAtmosphereLerp) {
      return;
    }

    const lerp = this.worldOneAtmosphereLerp;
    lerp.elapsed += deltaMs;
    const t = Phaser.Math.Clamp(lerp.elapsed / Math.max(1, lerp.duration), 0, 1);
    const eased = Phaser.Math.Easing.Cubic.Out(t);
    const s = lerp.start;
    const e = lerp.target;

    this.worldOneAtmosphereCurrent = {
      key: e.key,
      wave: e.wave,
      overlayOpacity: Phaser.Math.Linear(s.overlayOpacity, e.overlayOpacity, eased),
      blendMode: t < 0.5 ? s.blendMode : e.blendMode,
      spriteCount: Math.round(Phaser.Math.Linear(s.spriteCount, e.spriteCount, eased)),
      opacityMin: Phaser.Math.Linear(s.opacityMin, e.opacityMin, eased),
      opacityMax: Phaser.Math.Linear(s.opacityMax, e.opacityMax, eased),
      scaleMin: Phaser.Math.Linear(s.scaleMin, e.scaleMin, eased),
      scaleMax: Phaser.Math.Linear(s.scaleMax, e.scaleMax, eased),
      driftXMin: Phaser.Math.Linear(s.driftXMin, e.driftXMin, eased),
      driftXMax: Phaser.Math.Linear(s.driftXMax, e.driftXMax, eased),
      driftYMin: Phaser.Math.Linear(s.driftYMin, e.driftYMin, eased),
      driftYMax: Phaser.Math.Linear(s.driftYMax, e.driftYMax, eased),
      windBase: Phaser.Math.Linear(s.windBase, e.windBase, eased),
      windSwing: Phaser.Math.Linear(s.windSwing, e.windSwing, eased),
      windY: Phaser.Math.Linear(s.windY, e.windY, eased),
      swayAmp: Phaser.Math.Linear(s.swayAmp, e.swayAmp, eased),
      swirlAmp: Phaser.Math.Linear(s.swirlAmp, e.swirlAmp, eased),
      pulseAmp: Phaser.Math.Linear(s.pulseAmp, e.pulseAmp, eased),
      opacityWaveAmp: Phaser.Math.Linear(s.opacityWaveAmp, e.opacityWaveAmp, eased),
    };
    this.worldOneAtmosphereConfig = this.worldOneAtmosphereCurrent;

    if (this.worldOneSmokeRoot) {
      this.worldOneSmokeRoot.style.opacity = String(this.worldOneAtmosphereCurrent.overlayOpacity);
    }
    if (this.worldOneSmokeRenderer?.domElement) {
      this.worldOneSmokeRenderer.domElement.style.mixBlendMode = this.worldOneAtmosphereCurrent.blendMode || 'normal';
    }

    if (t >= 1) {
      this.worldOneAtmosphereLerp = null;
      this.worldOneAtmosphereCurrent = { ...e };
      this.worldOneAtmosphereConfig = this.worldOneAtmosphereCurrent;
      this.rebuildWorldOneSmokeSprites(this.worldOneAtmosphereCurrent);
      this.syncWorldOneSmokeBounds(true);
    }
  },

  updateWorldOneSmokeState: function () {
    if (this.shouldEnableWorldOneSmoke()) {
      this.ensureWorldOneSmoke();
      return;
    }
    this.destroyWorldOneSmoke();
  },

  ensureWorldOneSmoke: function () {
    if (this.worldOneSmokeRenderer) {
      this.syncWorldOneSmokeBounds();
      return;
    }

    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }

    const initialProfile = this.getWorldOneAtmosphereProfile(Math.max(1, this.gameState?.wave || 1));
    this.worldOneAtmosphereCurrent = { ...initialProfile };
    this.worldOneAtmosphereTarget = { ...initialProfile };
    this.worldOneAtmosphereConfig = this.worldOneAtmosphereCurrent;

    const root = document.createElement('div');
    root.setAttribute('data-world-one-smoke', 'true');
    root.style.position = 'fixed';
    root.style.left = '0px';
    root.style.top = '0px';
    root.style.width = '0px';
    root.style.height = '0px';
    root.style.pointerEvents = 'none';
    root.style.zIndex = '6';
    root.style.opacity = String(initialProfile.overlayOpacity);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.mixBlendMode = initialProfile.blendMode || 'normal';
    root.appendChild(renderer.domElement);
    document.body.appendChild(root);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-500, 500, 300, -300, 0.1, 10);
    camera.position.z = 2;

    this.worldOneSmokeRoot = root;
    this.worldOneSmokeRenderer = renderer;
    this.worldOneSmokeScene = scene;
    this.worldOneSmokeCamera = camera;
    this.worldOneSmokeSprites = [];
    this.worldOneSmokeElapsed = 0;

    this.rebuildWorldOneSmokeSprites(initialProfile);

    this.worldOneSmokeResizeHandler = () => this.syncWorldOneSmokeBounds();
    this.worldOneSmokeScaleResizeHandler = () => this.syncWorldOneSmokeBounds();
    window.addEventListener('resize', this.worldOneSmokeResizeHandler);
    this.scale.on('resize', this.worldOneSmokeScaleResizeHandler);

    this.syncWorldOneSmokeBounds(true);
  },

  syncWorldOneSmokeBounds: function (resetSprites = false) {
    if (!this.worldOneSmokeRoot || !this.worldOneSmokeRenderer || !this.worldOneSmokeCamera || !this.game?.canvas) {
      return;
    }

    const rect = this.game.canvas.getBoundingClientRect();
    const width = Math.max(1, Math.floor(rect.width));
    const fullHeight = Math.max(1, Math.floor(rect.height));
    const hudRoot = typeof document !== 'undefined' ? document.getElementById('ab-hud-overlay') : null;
    const topInset = hudRoot ? Math.max(0, Math.round(hudRoot.getBoundingClientRect().height)) : Math.round(fullHeight * 0.18);
    const bottomInset = Math.max(70, Math.round(fullHeight * 0.15));
    const height = Math.max(1, fullHeight - topInset - bottomInset);

    this.worldOneSmokeRoot.style.left = Math.round(rect.left) + 'px';
    this.worldOneSmokeRoot.style.top = Math.round(rect.top + topInset) + 'px';
    this.worldOneSmokeRoot.style.width = width + 'px';
    this.worldOneSmokeRoot.style.height = height + 'px';

    this.worldOneSmokeRenderer.setSize(width, height, false);
    this.worldOneSmokeCamera.left = -width * 0.5;
    this.worldOneSmokeCamera.right = width * 0.5;
    this.worldOneSmokeCamera.top = height * 0.5;
    this.worldOneSmokeCamera.bottom = -height * 0.5;
    this.worldOneSmokeCamera.updateProjectionMatrix();

    const prevWidth = this.worldOneSmokeBounds.width;
    const prevHeight = this.worldOneSmokeBounds.height;
    this.worldOneSmokeBounds.width = width;
    this.worldOneSmokeBounds.height = height;

    if (resetSprites || prevWidth !== width || prevHeight !== height) {
      this.worldOneSmokeSprites.forEach((sprite) => {
        const { baseScale } = sprite.userData;
        sprite.position.x = (Math.random() - 0.5) * width * 1.3;
        sprite.position.y = (Math.random() - 0.5) * height * 0.9;
        sprite.scale.set(baseScale, baseScale, 1);
      });
    }
  },

  animateWorldOneSmoke: function (deltaMs) {
    if (!this.worldOneSmokeRenderer || !this.shouldEnableWorldOneSmoke()) {
      return;
    }

    const width = this.worldOneSmokeBounds.width;
    const height = this.worldOneSmokeBounds.height;
    if (!width || !height) {
      return;
    }

    this.stepWorldOneAtmosphereTransition(deltaMs || 16);
    const cfg = this.worldOneAtmosphereCurrent || this.worldOneAtmosphereConfig || this.getWorldOneAtmosphereProfile(Math.max(1, this.gameState?.wave || 1));
    const dt = Math.min(0.07, Math.max(0.001, (deltaMs || 16) / 1000));
    this.worldOneSmokeElapsed += dt;
    const windX = cfg.windBase + Math.sin(this.worldOneSmokeElapsed * 0.22) * cfg.windSwing;
    const windY = Math.sin(this.worldOneSmokeElapsed * 0.31) * (cfg.windY * 1.6);

    for (let i = 0; i < this.worldOneSmokeSprites.length; i += 1) {
      const sprite = this.worldOneSmokeSprites[i];
      const data = sprite.userData;
      const sway = Math.sin(this.worldOneSmokeElapsed * 0.34 + data.phase) * cfg.swayAmp;
      const verticalSwirl = Math.cos(this.worldOneSmokeElapsed * 0.46 + data.phase) * cfg.swirlAmp;
      sprite.position.x += (windX + data.driftX + sway) * dt;
      sprite.position.y += (windY + data.driftY + verticalSwirl) * dt;

      const wrapX = width * 0.75 + data.baseScale * 0.5;
      const wrapY = height * 0.6 + data.baseScale * 0.5;
      if (sprite.position.x > wrapX) sprite.position.x = -wrapX;
      if (sprite.position.x < -wrapX) sprite.position.x = wrapX;
      if (sprite.position.y > wrapY) sprite.position.y = -wrapY;
      if (sprite.position.y < -wrapY) sprite.position.y = wrapY;

      const pulse = 1 + Math.sin(this.worldOneSmokeElapsed * 0.25 + data.phase) * cfg.pulseAmp;
      sprite.scale.set(data.baseScale * pulse, data.baseScale * pulse, 1);
      sprite.material.opacity = data.baseOpacity * (0.72 + Math.sin(this.worldOneSmokeElapsed * 0.45 + data.phase) * cfg.opacityWaveAmp);
    }

    this.worldOneSmokeRenderer.render(this.worldOneSmokeScene, this.worldOneSmokeCamera);
  },

  spawnLightningProtectionBlob: function (worldX, worldY, durationMs = 420) {
    return spawnLightningProtectionBlob.call(this, worldX, worldY, durationMs);
  },

  destroyLightningProtectionOverlays: function () {
    if (!Array.isArray(this.lightningProtectionOverlays) || this.lightningProtectionOverlays.length === 0) {
      this.lightningProtectionOverlays = [];
      return;
    }

    const cleanupFns = this.lightningProtectionOverlays.slice();
    this.lightningProtectionOverlays.length = 0;
    cleanupFns.forEach((cleanup) => {
      try {
        cleanup?.();
      } catch (_) {}
    });
  },

  destroyWorldOneSmoke: function () {
    if (this.worldOneSmokeResizeHandler && typeof window !== 'undefined') {
      window.removeEventListener('resize', this.worldOneSmokeResizeHandler);
    }
    if (this.worldOneSmokeScaleResizeHandler && this.scale) {
      this.scale.off('resize', this.worldOneSmokeScaleResizeHandler);
    }
    this.worldOneSmokeResizeHandler = null;
    this.worldOneSmokeScaleResizeHandler = null;

    if (this.worldOneSmokeScene) {
      this.worldOneSmokeScene.traverse((obj) => {
        if (obj.material) {
          obj.material.dispose?.();
        }
      });
    }

    if (this.worldOneSmokeRenderer) {
      this.worldOneSmokeRenderer.dispose();
      this.worldOneSmokeRenderer.forceContextLoss?.();
    }

    if (this.worldOneSmokeRoot?.parentNode) {
      this.worldOneSmokeRoot.parentNode.removeChild(this.worldOneSmokeRoot);
    }

    this.worldOneSmokeRoot = null;
    this.worldOneSmokeRenderer = null;
    this.worldOneSmokeScene = null;
    this.worldOneSmokeCamera = null;
    this.worldOneSmokeSprites = [];
    this.worldOneSmokeElapsed = 0;
    this.worldOneSmokeBounds.width = 0;
    this.worldOneSmokeBounds.height = 0;
    this.worldOneAtmosphereConfig = null;
    this.worldOneAtmosphereCurrent = null;
    this.worldOneAtmosphereTarget = null;
    this.worldOneAtmosphereLerp = null;
    this.worldOneAtmosphereKey = null;
  },

  showWorldSelectionSplashScreen: function () {
    try {
      console.log('[GameFlow]', {
        event: 'show_world_selection_splash',
        page: window.location.pathname + window.location.search,
        loggedIn: !!window.__supabaseUserId,
        userId: window.__supabaseUserId || null,
      });
    } catch (_) {}
    this.destroyWorldOneSmoke();
    this.playSettingsThemeMusic();

    // World-select must own all pointer interaction; ensure in-game overlays are gone.
    this.teardownHtmlHudOverlay?.();
    if (typeof window !== 'undefined' && typeof window.__setHtmlTrayVisible === 'function') {
      window.__setHtmlTrayVisible(false);
    }
    try {
      document.querySelectorAll('[data-weapon-tray-root]').forEach((node) => node.remove());
    } catch (_) {}

    // Expose scene and data for the HTML overlay
    window.__tdScene = this;
    window.WORLDS_DATA = WORLDS;
    window.WEAPON_LIBRARY_MAP = Object.fromEntries(WEAPON_LIBRARY.map((w) => [w.id, w]));
    window.PATH_LAYOUT_TEMPLATES_DATA = PATH_LAYOUT_TEMPLATES.map(t => t.points || []);

    // Init Supabase auth once — loads remote profile if signed in and merges into local.
    if (!window.__supabaseAuthInitialized) {
      window.__supabaseAuthInitialized = true;
      import('./systems/game-supabase-auth-system.js').then(({ initSupabaseAuth, mergeProfiles }) => {
        initSupabaseAuth((user, remoteProfile) => {
          try {
            const local = this.loadCommanderData?.() || {};
            const merged = mergeProfiles(local, remoteProfile);
            if (merged) {
              this.saveCommanderData?.({ ...merged, name: merged.name || user.user_metadata?.full_name || local.name || 'Player' });
              if (this.gameState) {
                this.gameState.playerLevel = Math.max(1, merged.level || 1);
                if (merged.weaponUpgradeLevels) this.gameState.weaponUpgradeLevels = merged.weaponUpgradeLevels;
              }
              if (typeof window.__refreshAuthUI === 'function') window.__refreshAuthUI();
            }
          } catch (_) {}
        });
      }).catch(() => {});
    }

    // Show the HTML overlay (exact CSS design)
    if (typeof window.__showWorldSelect === 'function') {
      if (typeof window.__dismissSplash === 'function') window.__dismissSplash();
      try {
        console.log('[GameFlow]', {
          event: 'show_world_select_overlay',
          page: window.location.pathname + window.location.search,
          loggedIn: !!window.__supabaseUserId,
          skipFrontStage: true,
        });
      } catch (_) {}
      window.__showWorldSelect({ skipFrontStage: true });
    }
  },

  initializeGameplayAfterWorldSelection: function () {
    return initializeGameplayAfterWorldSelectionSystem.call(this, { EmbossPipeline });
  },
});

const config = {
  type: Phaser.AUTO,
  width: BOARD_WIDTH,
  height: BOARD_HEIGHT,
  resolution: Math.min(window.devicePixelRatio || 1, window.__appPlatform?.isMobile ? 1.25 : 2),
  scale: {
    mode: Phaser.Scale.ENVELOP,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: BOARD_WIDTH,
    height: BOARD_HEIGHT,
    expandParent: true,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
  scene: GameScene,
  parent: 'game-container',
  backgroundColor: 'rgba(0,0,0,0)',
  render: {
    pixelArt: false,
    antialias: !window.__appPlatform?.isMobile,
    smoothStep: !window.__appPlatform?.isMobile,
    roundPixels: false,
    powerPreference: window.__appPlatform?.isMobile ? 'high-performance' : 'default',
  },
};

const game = new Phaser.Game(config);
const fullscreenTarget = document.documentElement;

const isFullscreenActive = () => Boolean(document.fullscreenElement || document.webkitFullscreenElement);

const requestFullscreenFallback = async () => {
  if (fullscreenTarget.requestFullscreen) {
    await fullscreenTarget.requestFullscreen();
    return;
  }
  if (fullscreenTarget.webkitRequestFullscreen) {
    fullscreenTarget.webkitRequestFullscreen();
  }
};

const exitFullscreenFallback = async () => {
  if (document.exitFullscreen) {
    await document.exitFullscreen();
    return;
  }
  if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
};

const toggleFullscreen = async () => {
  try {
    if (game.scale?.fullscreen?.available) {
      game.scale.toggleFullscreen();
      return;
    }
    if (isFullscreenActive()) {
      await exitFullscreenFallback();
      return;
    }
    await requestFullscreenFallback();
  } catch (error) {
    // Fullscreen requests can fail when browser gesture requirements are not met.
    console.warn('Unable to toggle fullscreen', error);
  }
};

const gameContainer = document.getElementById('game-container');
if (gameContainer) {
  gameContainer.addEventListener('dblclick', () => {
    try {
      const gp = JSON.parse(localStorage.getItem('tdGameplaySettingsV1') || '{}');
      if (gp.doubleClickFullscreen === false) return;
    } catch (_) {}
    void toggleFullscreen();
  });
}

document.addEventListener('keydown', (event) => {
  if (event.repeat) {
    return;
  }
  const target = event.target;
  const tagName = typeof target?.tagName === 'string' ? target.tagName.toUpperCase() : '';
  if (tagName === 'INPUT' || tagName === 'TEXTAREA' || target?.isContentEditable) {
    return;
  }
  if (event.key === 'Escape') {
    if (game.scale?.isFullscreen) {
      game.scale.stopFullscreen();
      return;
    }
    if (isFullscreenActive()) {
      void exitFullscreenFallback();
    }
    return;
  }
  if (event.key !== 'f' && event.key !== 'F') {
    return;
  }
  void toggleFullscreen();
});
