import { ITS_JUST_ANGULAR } from '@angular/core/src/r3_symbols';
import { TestBed } from '@angular/core/testing';
import { SerialisedDocumentStore } from 'elasticlunr';
import { ElasticService } from './ng-elasticlunr.service';

describe('ElasticService', () => {
    let service: ElasticService;

    beforeEach(() => {
        service = new ElasticService();
    });

    it('should be an instance of ElasticService', () => {
        expect(service).toBeDefined();
        expect(service instanceof ElasticService).toBeTrue();
    });

    describe('addField, getFields', () => {
        it('should not contain any field by default', () => {
            expect(service.getFields().length).toEqual(0);
        });
        it('should contain one field if addField is used before', () => {
            service.addField('title');
            expect(service.getFields().length).toEqual(1);
        });
    });

    describe('toJson, addDoc, setRef, removeDoc, removeDocByRef', () => {
        it('should return a json object if document has not been added', () => {
            const json = service.toJSON();
            const documentStore: SerialisedDocumentStore<any> = json.documentStore;
            
            expect((documentStore as any).length).toEqual(0);
        });
        it('should return a json object with one document if a document has been added', () => {
            service.addDoc({ id: 1, title: 'title', body: 'body', tag: ['tag1', 'tag2']});

            const json = service.toJSON();
            const documentStore: SerialisedDocumentStore<any> = json.documentStore;

            expect((documentStore as any).length).toEqual(1);
        });
        it('should return a json object with no document if document has been removed', () => {
            service.removeDoc({ id: 1, title: 'title', body: 'body', tag: ['tag1', 'tag2']});

            const json = service.toJSON();
            const documentStore: SerialisedDocumentStore<any> = json.documentStore;
            expect((documentStore as any).length).toEqual(0);
        });
        it('should remove a document from json object using ref id by default', () => {
            service.addDoc({ id: 1, title: 'title', body: 'body', tag: ['tag1', 'tag2']});

            service.removeDocByRef(1);

            const json = service.toJSON();
            const documentStore: SerialisedDocumentStore<any> = json.documentStore;

            expect((documentStore as any).length).toEqual(0);
        });
        it('should remove a document from json object using ref setting ref by default', () => {
            service.addDoc({ anotherId: 0, id: 2, title: 'title', body: 'body', tag: ['tag1', 'tag2']});

            service.removeDocByRef(1);

            const json = service.toJSON();
            const documentStore: SerialisedDocumentStore<any> = json.documentStore;

            expect((documentStore as any).length).toEqual(1);

            service.setRef('anotherId');


            service.removeDocByRef(0);

            const json2 = service.toJSON();
            const documentStore2: SerialisedDocumentStore<any> = json2.documentStore;

            expect((documentStore2 as any).length).toEqual(1);
        });
    });

    describe('saveDocument', () => {
        it('should return true as default value', () => {
            const json = service.toJSON();

            expect((json.documentStore as any).save).toBeTrue();
        });
        it('should return false if set to false', () => {
            service.saveDocument(false);

            const json = service.toJSON();
            expect((json.documentStore as any).save).toBeFalse();
        });
    });

    describe('search : no docs', () => {
        it('should return an empty object if documents have not been added', () => {
            const items = service.search('title');

            expect(items.length).toEqual(0);
        });
    });

    describe('search : docs', () => {
        beforeEach(() => {
            service.addField('title');
            service.addField('body');
            service.addField('tags');
            service.setRef('id');
            service.saveDocument(false);

            const data = [
                {
                    "id": 1,
                    "title": "Oracle released its latest database Oracle 12g",
                    "description": "Yestaday Oracle has released its new database Oracle 12g, this would make more money for this company and lead to a nice profit report of annual year.",
                    "tags": ['e-commerce', 'business']
                },
                {
                    "id": 2,
                    "title": "Oracle released its profit report of 2015",
                    "description": "As expected, Oracle released its profit report of 2015, during the good sales of database and hardware, Oracle's profit of 2015 reached 12.5 Billion.",
                    "tags": ['business', 'retail', 'e-commerce']
                }
            ];
            data.forEach((doc) => {
                service.addDoc(doc);
            });
        });

        it('should return document with id 1 as the one with higher score because contains more occurrences of Oracle : 4 > 3', () => {
            const items = service.search('Oracle');

            console.log('1:', items);
            expect(items.length).toEqual(2);

            expect(items[0].ref === '1').toBeTrue();
            expect(items[0].score > items[1].score).toBeTrue();
        });

        it('should return document with id 1 as the one with higher score because contains more occurrences of Oracle : 4 > 3 : lowercase', () => {
            const items = service.search('oracle');

            console.log('2:', items);
            expect(items.length).toEqual(2);

            expect(items[0].ref === '1').toBeTrue();
            expect(items[0].score > items[1].score).toBeTrue();
        });

        it('should return document with id 1 as the one with higher score because contains more occurrences of Oracle : 4 > 3 : uppercase', () => {
            const items = service.search('ORACLE');

            console.log('3:', items);
            expect(items.length).toEqual(2);

            expect(items[0].ref === '1').toBeTrue();
            expect(items[0].score > items[1].score).toBeTrue();
        });

        it('should return only one document with id 2 as the one with higher score because contains more occurrences of profit: 1 < 3 ' , () => {
            const items = service.search('profit');

            console.log('3.1:', items);
            expect(items.length).toEqual(1);

            expect(items[0].ref === '2').toBeTrue();
        });

        it('should return an array with two objects if word can be found in both documents', () => {
            const items = service.search('Oracle released');

            console.log('4:', items);
            expect(items.length).toEqual(2);
            expect(items[0].ref === '1').toBeTrue();
        });
        
        it('should return an array with two objects if word can be found in both documents regardless the order', () => {
            const items = service.search('released Oracle');

            console.log('5:', items);
            expect(items.length).toEqual(2);
            expect(items[0].ref === '1').toBeTrue();
        });
        
        it('should return an array with two objects if word can be found in both documents regardless the case', () => {
            const items = service.search('Released oracle');

            console.log('6:', items);
            expect(items.length).toEqual(2);
            expect(items[0].ref === '1').toBeTrue();
        });

        it('should return an array with two objects and first doc is the one with id 2 if both words are found in both documents but profit has more occurrences there', () => {
            const items = service.search('profit oracle');

            console.log('7:', items);
            expect(items.length).toEqual(2);
            expect(items[0].ref === '2').toBeTrue();
        });

        it('should return an array with document with id 2 as "retail" tag only exists there', () => {
            const items = service.search('retail');

            console.log('8:', items);
            expect(items.length).toEqual(1);
            expect(items[0].ref === '2').toBeTrue();
        });
    });
});