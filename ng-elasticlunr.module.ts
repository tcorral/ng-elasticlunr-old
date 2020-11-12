import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ElasticService } from './ng-elasticlunr.service';

@NgModule({
    imports: [
        CommonModule
    ],
    providers: [ 
        {
            provide: ElasticService,
            useFactory: () => new ElasticService(),
        }
    ]
})
export class ElasticlunrModule { }