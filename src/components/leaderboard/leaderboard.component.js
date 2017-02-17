
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import './leaderboard.less';
import template from './leaderboard.html';

import { LeaderboardService } from '../../services/leaderboard.service';

@Component({
  selector: 'leaderboard',
  providers: [LeaderboardService],
  template
})
export class LeaderboardComponent {
  static get parameters() {
    return [[LeaderboardService]];
  }

  constructor(leaderboardService) {
    this.leaderboardService = leaderboardService;
    this.cardOrder = [
      { name: 'Most Levels',          key: 'levelLeaders',          dataKey: 'level',               format: (data) => `Level ${data.toLocaleString()}` },
      { name: 'Most Fateful',         key: 'fateLeaders',           dataKey: 'fates',               format: (data) => `${data.toLocaleString()} Providences` },
      { name: 'Most Collectibles',    key: 'collectibleLeaders',    dataKey: 'uniqueCollectibles',  format: (data) => `${data} Collectibles` },
      { name: 'Most Achievements',    key: 'achievementLeaders',    dataKey: 'uniqueAchievements',  format: (data) => `${data} Achievements` },
      { name: 'Most Titles',          key: 'titleLeaders',          dataKey: 'totalTitles',         format: (data) => `${data} Titles` },
      { name: 'Richest',              key: 'goldLeaders',           dataKey: 'gold',                format: (data) => `${data.toLocaleString()} Gold` },
      { name: 'Eventful',             key: 'eventLeaders',          dataKey: 'events',              format: (data) => `${data.toLocaleString()} Events` },
      { name: 'Best Luck',            key: 'goodLuckLeaders',       dataKey: 'luk',                 format: (data) => `${data.toLocaleString()} LUK` },
      { name: 'Gladiatorial',         key: 'combatWinLeaders',      dataKey: 'combatWin',           format: (data) => `${data.toLocaleString()} Battles Won` },
      { name: 'Damaging',             key: 'damageLeaders',         dataKey: 'damage',              format: (data) => `${data.toLocaleString()} Damage` },
      { name: 'Overkiller',           key: 'overkillLeaders',       dataKey: 'damage',              format: (data) => `${data.toLocaleString()} Damage` },
      { name: 'Spongiest',            key: 'takenDamageLeaders',    dataKey: 'damage',              format: (data) => `${data.toLocaleString()} Damage` },
      { name: 'Well-traveled',        key: 'stepLeaders',           dataKey: 'steps',               format: (data) => `${data.toLocaleString()} Steps` },
      { name: 'Lone Wolf',            key: 'soloLeaders',           dataKey: 'steps',               format: (data) => `${data.toLocaleString()} Steps` },
      { name: 'Lush Wolf',            key: 'drunkLeaders',          dataKey: 'steps',               format: (data) => `${data.toLocaleString()} Steps` }
    ];
  }

  ngOnInit() {
    Observable.timer(0, 5000)
      .flatMap(() => {
        return this.leaderboardService.getLeaderboard();
      }).subscribe(data => {
        this.leaderboard = data;
      });
  }
}