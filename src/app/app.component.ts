import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { map, Subject, takeUntil } from "rxjs";
import { IProductInformation } from "./types";

type IProductInformationFormGroupType = { [k in keyof IProductInformation]: FormControl<IProductInformation[k] | null> };

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

  readonly productFormGroup: FormGroup<IProductInformationFormGroupType>;

  private readonly destroy$ = new Subject<void>();

  constructor(activedRoute: ActivatedRoute) {
    this.productFormGroup = new FormGroup<IProductInformationFormGroupType>({
      brand: new FormControl<string>(""),
      lotNumber: new FormControl<string>(""),
    })

    activedRoute.queryParamMap
      .pipe(
        map((c): IProductInformation => ({
          brand: c.get("product.brand") ?? "",
          lotNumber: c.get("product.lot") ?? ""
        })),
        takeUntil(this.destroy$)
      )
      .subscribe(c => {
        this.productFormGroup.setValue(c);
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
  }
}
