const elasticlunr = require('elasticlunr');
import type { Bool, DocumentReference, EventHandler, EventType, FieldSearchConfig, Index, IndexDocuments, IndexTokens, SearchConfig, SearchResults, SearchScores, SerialisedIndexData } from 'elasticlunr';

export class ElasticService {
    private readonly index: Index<any>;

    constructor() {
        this.index = elasticlunr();
    }

    addDoc(document: any): void {
        this.index.addDoc(document);
    }

    addField(fieldName: string | number | symbol): Index<any> {
        return this.index.addField(fieldName);
    }

    coordNorm(scores: SearchScores, docTokens: IndexTokens, n: number): SearchScores | undefined {
        return this.index.coordNorm(scores, docTokens, n);
    }

    fieldSearch(queryTokens: string[], fieldName: string | number | symbol, config: FieldSearchConfig<any>): SearchScores | undefined {
        
        return this.index.fieldSearch(queryTokens, fieldName, config);
    }

    fieldSearchStats(docTokens: IndexTokens, token: string, docs: IndexDocuments<any>): void {
        return this.index.fieldSearchStats(docTokens, token, docs);
    }

    getFields(): (string | number | symbol)[] {
        return this.index.getFields();
    }

    idf(term: string, field: string | number | symbol): number {
        return this.idf(term, field);
    }

    mergeScores(accumScores: SearchScores | null, scores: SearchScores, op: Bool): SearchScores {
        return this.index.mergeScores(accumScores, scores, op);
    }

    off(name: EventType, fn: EventHandler): void {
        return this.index.off(name, fn);
    }

    on(name: EventType, fn: EventHandler): void {
        return this.index.on(name, fn);
    }

    removeDoc(document: any): void {
        this.index.removeDoc(document);
    }
    
    removeDocByRef(ref: DocumentReference): void {
        this.index.removeDocByRef(ref);
    }
    
    saveDocument(save: boolean): Index<any> {
        return this.index.saveDocument(save);
    }

    search(query: string, userConfig?: SearchConfig<any> | undefined): SearchResults[] {
        return this.index.search(query, userConfig);
    }

    setRef(refName: string | number | symbol): Index<any> {
        return this.index.setRef(refName);
    }

    toJSON(): SerialisedIndexData<any> {
        return this.index.toJSON();
    }

    updateDoc(doc: any, emitEvent?: boolean | undefined): void {
        this.index.updateDoc(doc, emitEvent);
    }

    use(plugin: (...args: any[]) => any, ...args: any[]): void {
        this.index.use(plugin, args);
    }
}