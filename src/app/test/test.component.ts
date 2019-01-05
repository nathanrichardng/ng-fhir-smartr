import { Component, OnInit } from '@angular/core';
import { FhirService } from 'ng-fhir-smartr';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {

  patients: any[];

  constructor(private fhirService: FhirService) { 
    
  }

  ngOnInit() {
    /**
     * We can subscribe to data from a namespace without actually having to populate it.
     * Once the "testing" namespace is populated by the Home component, data should appear
     * here as well.
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
    
  }

}
