import { Component, ElementRef, ViewChild, AfterViewInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { OrdersService } from '../../../../../../core/features/orders/services/orders.service';
import { Order } from '../../../../../../core/features/orders/models/orders.model';

Chart.register(...registerables);

export interface ChartData {
  mes: string;
  realizadas: number;
  canceladas: number;
}

@Component({
  selector: 'app-chart-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chart-orders.html',
})
export class ChartOrdersComponent implements AfterViewInit {
  @ViewChild('chartCanvas') private chartCanvas!: ElementRef<HTMLCanvasElement>;
  private chartInstance?: Chart;
  private ordersService = inject(OrdersService);

  private readonly monthsNames = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ];

  public chartData: ChartData[] = this.monthsNames.map((mes) => ({
    mes,
    realizadas: 0,
    canceladas: 0,
  }));

  ngAfterViewInit(): void {
    this.carregarDados();
  }

  private carregarDados(): void {
    this.ordersService.getOrders().subscribe({
      next: (orders: Order[]) => {
        this.processarPedidos(orders);
        this.renderChart();
      },
      error: () => {
        this.renderChart();
      },
    });
  }

  private processarPedidos(orders: Order[]): void {
    this.chartData.forEach((d) => {
      d.realizadas = 0;
      d.canceladas = 0;
    });

    orders.forEach((order) => {
      if (!order.created_at) return;

      const dataCriacao = new Date(order.created_at);
      const indiceMes = dataCriacao.getMonth();

      if (indiceMes >= 0 && indiceMes < 12) {
        if (order.status === 'ACCEPTED') {
          this.chartData[indiceMes].realizadas++;
        } else if (order.status === 'CANCELED' || order.status === 'REJECTED') {
          this.chartData[indiceMes].canceladas++;
        }
      }
    });
  }

  private renderChart(): void {
    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    if (this.chartInstance) {
      this.chartInstance.destroy();
    }

    const labels = this.chartData.map((d) => d.mes);
    const realizadasData = this.chartData.map((d) => d.realizadas);
    const canceladasData = this.chartData.map((d) => d.canceladas);

    const maxVal = Math.max(...realizadasData, ...canceladasData, 10);
    const yMax = Math.ceil(maxVal / 10) * 10;

    const config: ChartConfiguration = {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Realizadas',
            data: realizadasData,
            backgroundColor: '#B0C2FF',
            barPercentage: 0.6,
            categoryPercentage: 0.5,
            borderRadius: 0,
          },
          {
            label: 'Canceladas',
            data: canceladasData,
            backgroundColor: '#1546EB6E',
            barPercentage: 0.6,
            categoryPercentage: 0.5,
            borderRadius: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            enabled: true,
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
            ticks: {
              color: '#6B7280',
              font: { size: 12 },
            },
          },
          y: {
            min: 0,
            max: yMax,
            ticks: {
              stepSize: Math.ceil(yMax / 8),
              color: '#6B7280',
              font: { size: 12 },
            },
            grid: {
              color: '#F3F4F6',
            },
          },
        },
      },
    };

    this.chartInstance = new Chart(ctx, config);
  }
}
