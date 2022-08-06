import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Hero }         from '../../models/hero';
import { HeroService }  from '../../services/hero.service';

@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: [ './hero-detail.component.css' ]
})
export class HeroDetailComponent implements OnInit {
  @Input() hero!: Hero;

  constructor(
    private route: ActivatedRoute,
    private heroService: HeroService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.getHero();
  }

  getHero(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.heroService.getHero(id)
      .subscribe(hero => this.hero = hero);
  }

  goBack(): void {
    this.location.back();
  }

  save(): void {
    this.heroService.updateHero(this.hero)
      .subscribe(() => this.goBack());
  }

  // method making aync operations via setTimeout
  // created just for demo of Async call testing
  saveAsync1(): void {
    debounce(() => {
      this.heroService.updateHero(this.hero)
        .subscribe(() => this.goBack());
    }, 250)();
  }

  // method making aync operations via Promise
  // created just for demo of Async call testing
  saveAsync2(): void {
    let promise = new Promise((resolve) => { resolve(null) });
    promise.then(() => {
      this.heroService.updateHero(this.hero)
        .subscribe(() => this.goBack());
    });
  }
}

function debounce(f: Function, wait: number, immediate: boolean = false) {
  let timeout: number | null;

  return function () {
    // let context = this;
    let args = arguments;
    let callNow = immediate && !timeout;

    const later = function () {
      timeout = null;
      if (!immediate) {
        f.apply(null, args);
      }
    };

    if (timeout) {
      window.clearTimeout(timeout);
    }

    if (callNow) {
      f.apply(null, args);
    }
    else {
      timeout = window.setTimeout(later, wait);
    }
  };
}
