import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/services/data.service';
import { ElasticService } from '../../../ng-elasticlunr.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'demo';
  documents: any[] = [];
  documentsFound: any[] = [];

  constructor(private readonly elasticService: ElasticService, private readonly dataService: DataService) {}

  ngOnInit() {
    this.documents = this.dataService.get();

    // Start Configure Index
    this.elasticService.addField('title');
    this.elasticService.addField('description');
    this.elasticService.addField('tags');
    this.elasticService.setRef('id');
    this.elasticService.saveDocument(false);
    // End Configure Index

    this.documents.forEach((doc) => {
      this.elasticService.addDoc(doc);
    });
  }

  search(event: any) {
    const value = event.target.value;
    const foundDocs = this.elasticService.search(value)
    this.documentsFound = foundDocs.map((doc) => {
      return this.documents.find((item) => Number(item.id) === Number(doc.ref));
    });
    console.log('--', this.documentsFound);
    console.log(this.elasticService.search(value));
  }
}
