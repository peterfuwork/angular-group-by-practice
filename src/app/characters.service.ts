import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class CharactersService {
  apiURL: string = "https://api.jsonbin.io/b/5ecc241be91d1e45d1115084/9";

  constructor(private httpClient: HttpClient) {}

  public getCharacters() {
    return this.httpClient.get(`${this.apiURL}`);
  }
}
