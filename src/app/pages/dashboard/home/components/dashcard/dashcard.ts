import { NgIf } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashcard',
  imports: [RouterLink],
  templateUrl: './dashcard.html',
 
  styleUrl: './dashcard.css',
})
export class Dashcard {
  title = input.required<string>();
  stats = input.required<number>();
  text = input.required<string>();
  money = input.required<boolean>();
  link = input.required<string>();

  formattedStats = computed(() => this.stats().toLocaleString('en-US'));
}
