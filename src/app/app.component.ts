import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormRecord, ValidatorFn, Validators } from "@angular/forms";
import { StepperOrientation } from '@angular/material/stepper';
import { ActivatedRoute } from "@angular/router";
import { filter, map, Observable, of, Subject, switchMap, takeUntil } from "rxjs";
import { environment } from "src/environments/environment";
import { Question } from "./questions";
import { IQuestionsRequest, IQuestionsRequestAnswer, QuestionsService } from "./services/questions.service";
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

  readonly authorized$: Observable<boolean>;

  readonly productFormGroup: FormGroup<FormGroupType<IProductInformation>>;
  readonly contactInformationFormGroup: FormGroup<FormGroupType<IContactInformation>>;
  readonly problemSummaryFormGroup: FormGroup<FormGroupType<IProblemSummary>>;
  readonly problemDetailsFormGroup: FormGroup;
  readonly problemDetailsQuestionsFormGroup: FormRecord;
  problemDetailsQuestions: Question[] = [];

  readonly stepperOrientation: Observable<StepperOrientation>;

  private readonly destroy$ = new Subject<void>();
  private readonly readyForMoreQuestions$ = new Subject<void>();

  constructor(
    private readonly questionsService: QuestionsService,
    activedRoute: ActivatedRoute,
    fb: FormBuilder,
    breakpointObserver: BreakpointObserver
  ) {

    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 1000px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));

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

    const problemDetailsDoneControl = fb.control<boolean>(false, [Validators.requiredTrue]);
    this.problemDetailsQuestionsFormGroup = fb.record({});
    this.problemDetailsFormGroup = fb.group({
      done: problemDetailsDoneControl,
      questions: this.problemDetailsQuestionsFormGroup
    });
    this.problemDetailsQuestionsFormGroup.statusChanges
      .pipe(
        filter(c => c === "VALID"),
        takeUntil(this.destroy$)
      )
      .subscribe(status => {
        this.getNextQuestions();
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

    this.readyForMoreQuestions$.pipe(
      map((): IQuestionsRequest => {

        const product = this.productFormGroup.value;
        const problemSummary = this.problemSummaryFormGroup.value;
        const problemDetails = this.problemDetailsQuestionsFormGroup.value;

        const answeredQuestions: IQuestionsRequestAnswer[] = [];
        for (const question of this.problemDetailsQuestions) {
          const response = problemDetails[question.id];
          answeredQuestions.push({ questionId: question.id, response });
        }

        return {
          product: {
            brand: product.brand!,
            lotNumber: product.lotNumber ?? null
          },
          userType: problemSummary.userType!,
          verbatim: problemSummary.issueVerbatim!,

          answeredQuestions
        };
      }),
      switchMap(c => this.questionsService.getNextQuestions(c)),
      takeUntil(this.destroy$)
    ).subscribe(resp => {
      if (resp.done) {
        problemDetailsDoneControl.setValue(true);
        return;
      }

      const problemDetailsQuestions = [...this.problemDetailsQuestions];

      for (const question of resp.questions) {
        const validators: ValidatorFn[] = [];
        if (question.required) {
          validators.push(Validators.required);
        }

        this.problemDetailsQuestionsFormGroup.addControl(question.id, fb.control<string>("", { validators }));
        problemDetailsQuestions.push(question);
      }

      this.problemDetailsQuestions = problemDetailsQuestions;
    });

    if (environment.token) {
      this.authorized$ = activedRoute.queryParamMap.pipe(
        map(c => c.get("token")),
        map(c => c === environment.token)
      );
    }
    else {
      this.authorized$ = of(true);
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  async onProblemSummarySubmitted() {
    for (const k in this.problemDetailsQuestionsFormGroup.controls) {
      if (!Object.prototype.hasOwnProperty.call(this.problemDetailsQuestionsFormGroup.controls, k)) {
        continue;
      }

      this.problemDetailsQuestionsFormGroup.removeControl(k);
    }

    this.problemDetailsQuestions = [];

    this.getNextQuestions();
  }

  private getNextQuestions() {
    this.readyForMoreQuestions$.next();
  }
}
