import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { map, Subject, takeUntil } from "rxjs";
import { IContactInformation, IProblemSummary, IProductInformation, UserTypes } from "./types";

type FormGroupType<T> = { [k in keyof T]: FormControl<T[k]> };

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
  readonly UserTypes = UserTypes;

  title = 'JNJ Smart Form POC';

  currentStepIndex = 0;
  problemSummaryReady = true;
  problemDetailsReady = false;
  reviewReady = false;

  readonly productFormGroup: FormGroup<FormGroupType<IProductInformation>>;
  readonly contactInformationFormGroup: FormGroup<FormGroupType<IContactInformation>>;
  readonly problemSummaryFormGroup: FormGroup<FormGroupType<IProblemSummary>>;

  private readonly destroy$ = new Subject<void>();

  constructor(activedRoute: ActivatedRoute, fb: FormBuilder) {
    this.productFormGroup = fb.group<FormGroupType<IProductInformation>>({
      brand: fb.control<string>("", { nonNullable: true, validators: [Validators.required] }),
      lotNumber: fb.control<string>("", {})
    });

    this.contactInformationFormGroup = fb.group<FormGroupType<IContactInformation>>({
      firstName: fb.control<string>("", { nonNullable: true, validators: [Validators.required] }),
      lastName: fb.control<string>("", { nonNullable: true, validators: [Validators.required] }),

      streetAddress: fb.control<string>("", { nonNullable: true, validators: [Validators.required] }),
      streetAddress2: fb.control<string>("", {}),
      city: fb.control<string>("", { nonNullable: true, validators: [Validators.required] }),
      state: fb.control<string>("", { nonNullable: true, validators: [Validators.required] }),
      zipPostal: fb.control<string>("", { nonNullable: true, validators: [Validators.required] })
    });

    this.problemSummaryFormGroup = fb.group<FormGroupType<IProblemSummary>>({
      issueVerbatim: fb.control<string>("", { nonNullable: true, validators: [Validators.required] }),
      userType: fb.control<UserTypes>(UserTypes.Patient, { nonNullable: true, validators: [Validators.required] }),
      images: fb.control<File[]>([], { nonNullable: true })
    });
    this.problemSummaryFormGroup.statusChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(c => {
        this.problemDetailsReady = c === "VALID";
      });

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

  problemSummarySubmit() {
    if (this.problemSummaryFormGroup.invalid) {
      return;
    }

    this.problemDetailsReady = true;
    this.currentStepIndex++;
  }
}
