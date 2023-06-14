/*
 * Vencord, a modification for Discord's desktop app
 * Copyright (c) 2023 Vendicated and contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

export const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
export const size = 5;

export const directions = {
    UP: [-1, 0], // up
    RIGHT: [0, 1], // right
    DOWN: [1, 0], // down
    LEFT: [0, -1], // left
    "TOP-RIGHT": [-1, 1], // up-right
    "BOTTOM-RIGHT": [1, 1], // down-right
    "BOTTOM-LEFT": [1, -1], // down-left
    "TOP-LEFT": [-1, -1] // up-left
} as const;

export const networkThingies = {
    "playersChanged": 1,
    "gameStateChanged": 2,
    "startGameRequest": 3,
    "restartGameRequest": 4,
    "remoteRestartGameSelected": 5,
    "addBotRequest": 6,
    "removeBotRequest": 7,
    "newTurnSequenceStart": 8,
    "newTurnSequenceEnd": 9,
    "newTurn": 10,
    "newTurnPrepare": 11,
    "wordAcceptedAnimDone": 12,
    "newLetters": 13,
    "newLettersAnimDone": 14,
    "newRound": 15,
    "newRoundAnimDone": 16,
    "newTurnShuffleBoard": 17,
    "newTurnShuffleBoardAnimDone": 18,
    "newMultiplierTile": 19,
    "newMultiplierTileAnimDone": 20,
    "gameOverSequenceStart": 21,
    "gameOverSequenceEnd": 22,
    "awardManaScore": 23,
    "awardManaScoreAnimDone": 24,
    "changePlayerStateRequest": 25,
    "playerStateChanged": 26,
    "gameFinishedSequence": 27,
    "startTimerSelected": 30,
    "remoteStartTimerSelected": 31,
    "remoteShowStartTimerButton": 32,
    "remoteExtendTimerSelected": 33,
    "gameTimerStateUpdate": 34,
    "gameTimerCountDownStarted": 35,
    "countDownTick": 36,
    "usePowerUp": 40,
    "sendPowerUpUse": 41,
    "powerUpUsed": 42,
    "useBooster": 45,
    "sendBoosterUse": 46,
    "boosterUsed": 47,
    "buyBooster": 48,
    "powerUpPrepare_change": 51,
    "powerUpAnimDone": 54,
    "boosterPrepareChange": 55,
    "boosterAnimDone": 56,
    "letterSelected": 60,
    "letterDeselected": 61,
    "wordStart": 62,
    "wordEnd": 63,
    "submitWord": 64,
    "boardUpdateReceived": 65,
    "wordRejected": 66,
    "wordAccepted": 67,
    "remoteLetterSelected": 68,
    "remoteSelectionCancelled": 69,
    "remoteLetterDeselected": 70,
    "overNewLetter": 71,
    "playSinglePlayer": 80,
    "startSinglePlayer": 81,
    "leaveCurrentGame": 82,
    "isMainMenuActive": 83,
    "updateEnchantmentDescriptionText": 84,
    "enableDisableEnchantmentUI": 85,
    "showMainMenuScreen": 90,
    "showSinglePlayerLevel": 92,
    "showSinglePlayerMap": 93,
    "show2vs2MatchMaking": 94,
    "showBoosterGiftPopup": 95,
    "showBoosterGiftPopupDone": 96,
    "showBoosterShopPopup": 97,
    "showBoosterPurchasePopup": 98,
    "playLive": 114,
    "gameReposition": 100,
    "gameReorientate": 101,
    "userDataUpdated": 110,
    "kicked": 120,
    "roomShutdown": 124,
    "debugLog": 130,
    "joinVersusLobby": 140,
    "leaveVersusLobby": 141,
    "findVersusOpponents": 142,
    "stopFindVersusOpponents": 143,
    "versusSearchStart": 144,
    "versusSearchUpdate": 145,
    "joinVersusMatch": 146
};
