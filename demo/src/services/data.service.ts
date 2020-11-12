import { Injectable } from "@angular/core";

@Injectable()
export class DataService {
    get() {
        return [
            {
                "id": 1,
                "title": "Oracle released its latest database Oracle 12g",
                "description": "Yestaday Oracle has released its new database Oracle 12g, this would make more money for this company and lead to a nice profit report of annual year.",
                "tags": ['pepe', 'juan', 'pedro']
            },
            {
                "id": 2,
                "title": "Oracle released its profit report of 2015",
                "description": "As expected, Oracle released its profit report of 2015, during the good sales of database and hardware, Oracle's profit of 2015 reached 12.5 Billion.",
                "tags": ['pepe', 'sancho', 'pablo']
            }
        ];
    }
}