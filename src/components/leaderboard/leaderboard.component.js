
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
      { name: 'Highest Level',        key: 'levelLeaders',          dataKey: 'level',               format: (data) => `Level ${data.toLocaleString()}` },
      { name: 'Highest Ascension',    key: 'ascensionLeaders',      dataKey: 'ascension',           format: (data) => `Ascension ${data}` },
      { name: 'Most Collectibles',    key: 'collectibleLeaders',    dataKey: 'uniqueCollectibles',  format: (data) => data },
      { name: 'Most Achievements',    key: 'achievementLeaders',    dataKey: 'uniqueAchievements',  format: (data) => data },
      { name: 'Most Titles',          key: 'titleLeaders',          dataKey: 'totalTitles',         format: (data) => data },
      { name: 'Richest',              key: 'goldLeaders',           dataKey: 'gold',                format: (data) => `${data.toLocaleString()} gold` },
      { name: 'Well-traveled',        key: 'stepLeaders',           dataKey: 'steps',               format: (data) => `${data.toLocaleString()} Steps` },
      { name: 'Gladiatorial',         key: 'combatWinLeaders',      dataKey: 'combatWin',           format: (data) => `${data.toLocaleString()} Battles Won` },
      { name: 'Eventful',             key: 'eventLeaders',          dataKey: 'events',              format: (data) => `${data.toLocaleString()} Events` },
      { name: 'Lone Wolf',            key: 'soloLeaders',           dataKey: 'steps',               format: (data) => `${data.toLocaleString()} Steps` },
      { name: 'Best Luck',            key: 'goodLuckLeaders',       dataKey: 'luk',                 format: (data) => `${data.toLocaleString()} LUK` },
      { name: 'Worst Luck',           key: 'badLuckLeaders',        dataKey: 'luk',                 format: (data) => `${data.toLocaleString()} LUK` }
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