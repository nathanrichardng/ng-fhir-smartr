import { Component, OnInit } from '@angular/core';
import { FhirService } from 'ng-fhir-smartr';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  
  patients: any[];

  constructor(private fhirService: FhirService) { 
    
  }

  ngOnInit() {
    /**
     * Subscribe to the "testing" namespace and populate our patients array
     * when updates are received.
     */
    this.fhirService.getDataFrom("testing").subscribe(FhirResponse => {
      console.log('Receiving observable data from namespace "testing"');
      console.log(FhirResponse);
      if(FhirResponse.status == 200) {
        this.patients = FhirResponse.data.entry.map(entry => {
          return {
            gender: entry.resource.gender,
            name: entry.resource.name[0].family[0] + ', ' + entry.resource.name[0].given[0]
          }
        });
      }
    });
    
    // Populate our "testing" namespace with results from a SMART search
    this.fhirService.queryInto("testing", { type: 'Patient', query: { name: 'bob'} });
  }

}
