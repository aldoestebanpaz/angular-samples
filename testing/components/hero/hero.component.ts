import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Hero } from '../../models/hero';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls:  ['./hero.component.css']
})
export class HeroComponent {
  @Input() hero!: Hero;
  @Output() delete = new EventEmitter();

  onDeleteClick($event: MouseEvent): void {
    $event.stopPropagation();
    this.delete.next(undefined);
  }
}
