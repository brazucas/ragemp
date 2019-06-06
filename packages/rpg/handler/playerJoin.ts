import { BrazucasServer } from '../../../common/brazucas-server';
import { Jogador } from '../../../common/database/models/Jogador';
import { BrazucasEventos } from '../interfaces/brazucas-eventos';
import { notificarTodos, playerEvent } from '../lib/functions/player';
import { Rpg } from '../rpg';

export function PlayerJoinHandler(brazucasServer: BrazucasServer, player: PlayerMp) {
  console.debug(`[ENTRADA] ${player.name} entrou no servidor (${player.ip})`);

  notificarTodos(`~y~${player.name} ~w~entrou no servidor`);

  const subscribe = brazucasServer.isReady.subscribe(async () => {
    const jogador = await brazucasServer.loadPlayer(player.name);

    if (jogador) {
      console.debug(`[LOAD PLAYER] Jogador ${jogador.nome} carregado`);
    } else {
      console.debug('[LOAD PLAYER] Jogador não encontrado');
    }


    Rpg.playerProvider.addPlayer({
      mp: player,
      storage: jogador,
    });

    playerEvent<Jogador>(player, BrazucasEventos.DADOS_JOGADOR, jogador.toJSON());
    subscribe.unsubscribe();
  });
}
