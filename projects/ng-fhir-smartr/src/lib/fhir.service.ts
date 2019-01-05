import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { map } from 'rxjs/operators';
let nativeFhir = require('fhir.js/src/adapters/native');


@Injectable({
  providedIn: 'root'
})
export class FhirService {

  private clientId: string;
  private secret: boolean;
  private serviceUri: string;
  private redirectUri: string;
  private tokenUri: string;
  private api: any = false;
  private _authenticated: BehaviorSubject<boolean>;
  private _data: SmartData;
  
  constructor() {
    console.log("construct FhirService");
    this._authenticated = <BehaviorSubject<boolean>>new BehaviorSubject(false);
    this._data = this._data ? this._data : {};
  }
  
  get authenticated() {
    return this._authenticated.asObservable();
  }
  
  getDataFrom(namespace) {
    this.confirmNamespace(namespace);
    return this._data[namespace].asObservable();
  }
  
  queryInto(namespace, query) {
    this.confirmNamespace(namespace);
    let performSearch = this.performSearch.bind(this);
    if(!this.api) { 
      this.authenticate().then((smart) => {
        performSearch(namespace, query);
      }); 
    }
    else {
      performSearch(namespace, query);
    }
  }
  
  confirmNamespace(namespace) {
    console.log("confirmNamespace");
    if(!this._data[namespace]) { 
      this._data[namespace] = <BehaviorSubject<FhirQuery>> new BehaviorSubject({ status: -1 }); 
    }
  }
  
  performSearch(namespace, query) {
    console.log("performSearch()");
    console.log(this._data);
    let _data = this._data
    this.api.search(query).then(function(data) {
      _data[namespace].next(data);
    }, function(error) {
      console.log(error);
    });
  }
  
  launch(config) {
    let clientId = config.clientId;
    let secret = config.secret;
    let serviceUri = config.serviceUri ? config.serviceUri : this.getUrlParameter("iss");
    let launchContextId = this.getUrlParameter("launch");
    let scope = config.scope;
    let state = config.state;
    let launchUri = window.location.protocol + "//" + window.location.host + window.location.pathname;
    let redirectUri = launchUri.replace(config.launchEndpoint, config.redirectEndpoint);
    let conformanceUri = serviceUri + "/metadata";
    
    fetch(conformanceUri)
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        console.log(json);
        let authUri, tokenUri;
        // Pull the fhir extension for oauth
        let smartExtension = json.rest[0].security.extension.filter((e) => {
          return (e.url === "http://fhir-registry.smarthealthit.org/StructureDefinition/oauth-uris");
        });
        // Grab the authorize and token urls from the oauth extension
        smartExtension[0].extension.forEach((arg) => {
          if(arg.url === "authorize") {
            authUri = arg.valueUri;
          }
          else if (arg.url === "token") {
            tokenUri = arg.valueUri;
          }
        });
        // store relevant values to state
        sessionStorage[state] = JSON.stringify({
          clientId: clientId,
          secret: secret,
          serviceUri: serviceUri,
          redirectUri: redirectUri,
          tokenUri: tokenUri,
        });
        // redirect to auth server
        let redirect = authUri + "?" +
          "response_type=code&" +
          "client_id=" + encodeURIComponent(clientId) + "&" +
          "scope=" + encodeURIComponent(scope) + "&" +
          "redirect_uri=" + encodeURIComponent(redirectUri) + "&" +
          "aud=" + encodeURIComponent(serviceUri) + "&" +
          "launch=" + launchContextId + "&" +
          "state=" + state;
        window.location.href = redirect;
      });
  }
  
  authenticate() {
    console.log("authenticating");
    // get the URL parameters received from the authorization server
    let state = this.getUrlParameter("state");
    let code = this.getUrlParameter("code");
    
    // load session variables
    let params = JSON.parse(sessionStorage[state]);
    let tokenUri = params.tokenUri;
    let clientId = params.clientId;
    let secret = params.secret;
    let serviceUri = params.serviceUri;
    let redirectUri = params.redirectUri;
    
    return this.sendAuthRequest(code, tokenUri, clientId, redirectUri, serviceUri);
  }
  
  sendAuthRequest(code, tokenUri, clientId, redirectUri, serviceUri) {
    let promise = fetch(tokenUri, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        code: code,
        grant_type: "authorization_code",
        redirect_uri: redirectUri,
        client_id: clientId
      })
    })
    .then(response => response.json())
    .then(json => { 
      let api = this.getApi(serviceUri, { bearer: json.access_token });
      return api;
    });
    return promise;
  }
  
  getApi(baseUrl, auth) {
    let api = nativeFhir({
      baseUrl: baseUrl,
      credentials: 'same-origin',
      auth: auth
    });
    this.api = api;
    this._authenticated.next(true);
    return api;
  }
  
  getUrlParameter(param) {
    const urlParams = new URLSearchParams(window.location.search);
    const paramValue = urlParams.get(param);
    return paramValue;
  }
  
}

export interface FhirQuery {
  status: number;
  data: any;
  headers: any;
  config: any;
}

export interface SmartData {
  [key: string]: BehaviorSubject<FhirQuery>;
} 