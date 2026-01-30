import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class ClientService {
    private httpp = inject(HttpClient);

    url = 'http://localhost:4000/api/clients';
    userId = '697a074ae69d8fab108fb6ab';

    getClients(): Observable<any> {
        return this.httpp.get(`${this.url}`);
    }
}