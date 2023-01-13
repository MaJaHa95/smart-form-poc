import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormRecord, ValidatorFn, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { firstValueFrom, map, Subject, takeUntil } from "rxjs";
import { Question } from "./questions";
import { QuestionsService } from "./services/questions.service";
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

  readonly productFormGroup: FormGroup<FormGroupType<IProductInformation>>;
  readonly contactInformationFormGroup: FormGroup<FormGroupType<IContactInformation>>;
  readonly problemSummaryFormGroup: FormGroup<FormGroupType<IProblemSummary>>;
  readonly problemDetailsFormGroup: FormRecord;
  problemDetailsQuestions: Question[] = [];

  private readonly destroy$ = new Subject<void>();

  constructor(private readonly questionsService: QuestionsService, activedRoute: ActivatedRoute, fb: FormBuilder) {
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

    this.problemDetailsFormGroup = fb.record({});

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

  async onProblemSummarySubmitted() {
    for (const k in this.problemDetailsFormGroup.controls) {
      if (!Object.prototype.hasOwnProperty.call(this.problemDetailsFormGroup.controls, k)) {
        continue;
      }

      this.problemDetailsFormGroup.removeControl(k);
    }

    const problemDetailsQuestions: Question[] = [];

    const product = this.productFormGroup.value;
    const problemSummary = this.problemSummaryFormGroup.value;

    const resp = await firstValueFrom(this.questionsService.getNextQuestions({
      product: {
        brand: product.brand!,
        lotNumber: product.lotNumber ?? null
      },
      userType: problemSummary.userType!,
      verbatim: problemSummary.issueVerbatim!
    }));

    for (const question of resp.questions) {
      const validators: ValidatorFn[] = [];
      if (question.required) {
        validators.push(Validators.required);
      }

      this.problemDetailsFormGroup.addControl(question.questionText, new FormControl<string>("", validators));
      problemDetailsQuestions.push(question);
    }

    this.problemDetailsQuestions = problemDetailsQuestions;
  }
}
