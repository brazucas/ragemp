///<reference path="../../../../node_modules/@types/ragemp-s/index.d.ts" />

import { ComandosAdmin } from './comandos-admin';

declare const mp: Mp;

export class Comandos extends ComandosAdmin {
  public static dararma(player: PlayerMp, weaponHash: string) {
    console.debug(`[COMANDOS - dararma] Dando arma ${weaponHash} para o jogador ${player.name}`);

    const asset = mp.joaat(weaponHash);

    player.giveWeapon(asset, 1000);

    player.notify(`Arma ${weaponHash} recebida!`);
  }

  public static posicaoatual(player: PlayerMp) {
    console.debug(`[COMANDOS - posicaoatual] Posição atual de ${player.name}: ${player.position.toString()}`);

    player.outputChatBox(`Posição atual: ${player.position.toString()}`);
  }

  public static browser(player: PlayerMp) {
    player.call('mostrarNavegador');
  }
}
