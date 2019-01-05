import { Component, OnInit } from '@angular/core';
import { FhirService } from 'ng-fhir-smartr';

@Component({
  selector: 'app-launch',
  templateUrl: './launch.component.html',
  styleUrls: ['./launch.component.scss']
})
export class LaunchComponent implements OnInit {

  constructor(private fhirService: FhirService) {
  }

  ngOnInit() {
    
    let launchConfig = {
      serviceUri: "http://launch.smarthealthit.org/v/r2/sim/eyJoIjoiMSIsImoiOiIxIn0/fhir", // Leave serviceUri undefined if application will be launched by EHR application
      clientId: "my_web_app",
      scope: "patient/*.read launch/patient",
      state: Math.round(Math.random()*100000000).toString(),
      launchEndpoint: "launch",
      redirectEndpoint: "",
    };
    
    this.fhirService.launch(launchConfig);
  }

}
