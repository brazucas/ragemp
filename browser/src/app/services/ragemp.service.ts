import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { BrazucasEventos } from '../../../../packages/rpg/interfaces/brazucas-eventos';
import { Jogador } from '../../interfaces/jogador.interface';

declare let mp: any;

export const PLAYER_NAME_REGEXP = new RegExp('([a-zA-Z,0-9]+(_|)[a-zA-Z,0-9]+)');
export const PLAYER_NAME_MINLENGTH = 3;
export const PLAYER_NAME_MAXLENGTH = 22;

@Injectable({
  providedIn: 'root'
})
export class RagempService {
  public dadosJogador$: BehaviorSubject<Jogador> = new BehaviorSubject(null);
  public playerName$: BehaviorSubject<string> = new BehaviorSubject(null);
  public jogadorLocal$: BehaviorSubject<Jogador> = new BehaviorSubject(null);
  public serverEvent$: Subject<ServerEvent> = new Subject();

  constructor() {
    if (!window) {
      (window as any) = {};
    }

    (window as any).my = window || {};
    (window as any).ragemp = (window as any).ragemp || {};
    (window as any).ragemp.setPlayerName = this.setPlayerName.bind(this);
    (window as any).ragemp.serverEvent = this.serverEvent.bind(this);
  }

  public callRagempEvent(event: string, data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const eventId = Math.round(Math.random() * 10000000);

      mp.trigger(BrazucasEventos.BROWSER, eventId, event, JSON.stringify(data));

      const subscriber = this.serverEvent$.subscribe((serverEvent: ServerEvent) => {
        console.debug(`[EVENTO] (ID ${eventId}) ${JSON.stringify(serverEvent)}`);

        if (typeof this[serverEvent.event] === 'function') {
          this[serverEvent.event](serverEvent.data);
        }

        if (serverEvent.eventId === eventId) {
          clearTimeout(timeout);
          resolve(serverEvent.data);
          subscriber.unsubscribe();
        }
      });

      const timeout = setTimeout(() => {
        subscriber.unsubscribe();
        reject('timeout');
      }, 10000);
    });
  }

  public setPlayerName(playerName: string) {
    this.playerName$.next(playerName);
  }

  public serverEvent(eventId: number, event: string, data: string) {
    this.serverEvent$.next({
      event: event,
      data: data,
      eventId: eventId,
    });
  }

  public [BrazucasEventos.DADOS_JOGADOR](jogador: Jogador) {
    this.dadosJogador$.next(jogador);
  }
}

export interface ServerEvent {
  eventId: number,
  event: string,
  data: any,
}
