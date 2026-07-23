import { Component, inject, input } from '@angular/core';

@Component({
  selector: 'app-title-header',
  imports: [],
  templateUrl: './title-header.html',
  styleUrl: './title-header.css',
})
export class TitleHeader {
  title = input.required<string>();
  subtitle = input.required<string>();

  name = input.required<string>();
  role = input<string>();
}
