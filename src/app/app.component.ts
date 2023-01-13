import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { map, Subject, takeUntil } from "rxjs";
import { IProductInformation } from "./types";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
  title = 'JNJ Smart Form POC';

  currentStepIndex = 0;
  problemDetailsReady = false;
  reviewReady = false;

  product: IProductInformation = {
    brand: "",
    lotNumber: ""
  }
  //productFormGroup: Formg

  private readonly destroy$ = new Subject<void>();

  constructor(activedRoute: ActivatedRoute) {
    activedRoute.queryParamMap
      .pipe(
        map((c): IProductInformation => ({
          brand: c.get("product.brand") ?? "",
          lotNumber: c.get("product.lot") ?? ""
        })),
        takeUntil(this.destroy$)
      )
      .subscribe(c => {
        this.product = c;
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
  }
}
