import { Component } from '@angular/core';
import { Header } from './components/header/header';
import { RouterOutlet } from "@angular/router";
import { Sidebar } from "./components/sidebar/sidebar";

@Component({
  selector: 'app-dashboard-layout',
  imports: [Header, RouterOutlet, Sidebar],
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.css',
})
export class DashboardLayout {}
