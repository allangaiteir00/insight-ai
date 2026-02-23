import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideNgIconsConfig } from '@ng-icons/core';
import { GANTT_GLOBAL_CONFIG, GANTT_I18N_LOCALE_TOKEN } from '@worktile/gantt';
import * as echarts from 'echarts';
import { provideEchartsCore } from 'ngx-echarts';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(),
    provideEchartsCore({ echarts }),
    provideNgIconsConfig({ size: '1rem' }),
    {
      provide: GANTT_GLOBAL_CONFIG,
      useValue: {
        locale: 'pt-br'
      }
    },
    {
      provide: GANTT_I18N_LOCALE_TOKEN,
      useValue: [
        {
          id: 'pt-br',
          views: {
            hour: { label: 'Hora', dateFormats: { primary: 'HH:mm', secondary: 'HH:mm' } },
            day: { label: 'Dia', dateFormats: { primary: 'dd/MM', secondary: 'dd/MM' } },
            week: { label: 'Semana', dateFormats: { primary: 'dd/MM', secondary: 'dd/MM' } },
            month: { label: 'Mês', dateFormats: { primary: 'MMM yyyy', secondary: 'MMM' } },
            quarter: { label: 'Trimestre', dateFormats: { primary: 'QQQ yyyy', secondary: 'QQQ' } },
            year: { label: 'Ano', dateFormats: { primary: 'yyyy', secondary: 'yyyy' } }
          }
        }
      ]
    }
  ]
};
