# ng-fhir-smartr

A library for creating SMART on FHIR applications with Angular

## Usage

#### Add the package to your Angular project
```javascript
npm install --save ng-fhir-smartr
```

#### Create a launch component
This is equivalent to creating a launch.html page with the standard SMART on FHIR js client, and will require you to define a launch configuration.
Once launched, the user will be redirected to the path assigned as the redirectEndpoint.

**Note**: Make sure to add this component to the 'launch' route in app-routine.module.ts 
```javascript
import { Component, OnInit } from '@angular/core';
import { FhirService } from 'ng-fhir-smartr';

...

export class LaunchComponent implements OnInit {

  // Inject FhirService into launch component
  constructor(private fhirService: FhirService) {}

  ngOnInit() {
    // Leave serviceUri undefined if application will be launched by EHR application
    let launchConfig = {
      serviceUri: "http://launch.smarthealthit.org/v/r2/sim/eyJoIjoiMSIsImoiOiIxIn0/fhir", 
      clientId: "my_web_app",
      scope: "patient/*.read launch/patient",
      state: Math.round(Math.random()*100000000).toString(),
      launchEndpoint: "launch",
      redirectEndpoint: "",
    };
    
    this.fhirService.launch(launchConfig);
  }

}
```

#### Use the FHIR service in custom components
``` javascript
import { Component, OnInit } from '@angular/core';
import { FhirService } from 'ng-fhir-smartr';

...

export class MyComponent implements OnInit {

  // Inject FhirService into the component
  constructor(private fhirService: FhirService) {}

  ngOnInit() {
  	/**
     * Perform a query and store the response in an Observable namespace.
     * (Arbitrarily titled "testing" in this example).
     */
    this.fhirService.queryInto("testing", { type: 'Patient', query: { name: 'bob'} });
    
    /**
     * Subscribe to the "testing" namespace and handle updates to the Observable
     */
    this.fhirService.getDataFrom("testing").subscribe(FhirResponse => {
      console.log('Receiving observable data from namespace "testing"');
      console.log(FhirResponse);
    });
  }
}
```

#### Test your application against the sandbox
[http://launch.smarthealthit.org](http://launch.smarthealthit.org)
