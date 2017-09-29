import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import {Observable} from "rxjs/Rx"

interface Query {
    body: string,
    options: RequestOptions
}

@Injectable()
export class GrapQLService {

    url: string = `http://localhost:8080`;

    constructor(private http:Http) { }

    public queryUsers(query:string, vars:any = {}): Observable<Response> {
        let {body, options} = GrapQLService.buildQuery(query, vars);
        let subSec = `users`;
        return this.http.post(this.url + `/${subSec}`, body, options);
    }

    static buildQuery(query:string, vars:any):Query {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        let body = JSON.stringify({
            query: query,
            vars: vars
        });
        let options = new RequestOptions(({headers: headers}));
        return {body, options};
    }
}