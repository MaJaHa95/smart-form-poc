import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnDestroy } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormRecord, ValidatorFn, Validators } from "@angular/forms";
import { StepperOrientation } from '@angular/material/stepper';
import { ActivatedRoute } from "@angular/router";
import { DateTime } from "luxon";
import { filter, map, Observable, of, startWith, Subject, switchMap, takeUntil } from "rxjs";
import { environment } from "src/environments/environment";
import { Question } from "./questions";
import { IQuestionsRequest, IQuestionsRequestAnswer, QuestionsService } from "./services/questions.service";
import { IAddress, IPersonalData, IPersonalInformation, IProblemSummary, IProductInformation, UserTypes } from "./types";

type FormGroupType<T> = {
  [k in keyof T]:
  T[k] extends string | DateTime | boolean | File[] | File | null | undefined
  ? FormControl<T[k]>
  : FormGroup<FormGroupType<T[k]>>
};

export interface StateGroup {
  letter: string;
  names: string[];
}

export const _filter = (opt: string[], value: string): string[] => {
  const filterValue = value.toLowerCase();

  return opt.filter(item => item.toLowerCase().includes(filterValue));
};

interface IProblemDetailsWithDone {
  done: boolean;
  questions: Record<string, any>;

  followUpOkay: boolean;
}

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
  readonly personalInformationFormGroup: FormGroup<FormGroupType<IPersonalInformation>>;
  readonly problemSummaryFormGroup: FormGroup<FormGroupType<IProblemSummary>>;
  readonly problemDetailsFormGroup: FormGroup<FormGroupType<IProblemDetailsWithDone>>;
  readonly problemDetailsQuestionsFormGroup: FormRecord;
  problemDetailsQuestions: Question[] = [];

  readonly stepperOrientation: Observable<StepperOrientation>;
  readonly stateGroupOptions$: Observable<StateGroup[]>;


  readonly stateGroups: StateGroup[] = [
    {
      letter: 'A',
      names: ['Alabama', 'Alaska', 'Arizona', 'Arkansas'],
    },
    {
      letter: 'C',
      names: ['California', 'Colorado', 'Connecticut'],
    },
    {
      letter: 'D',
      names: ['Delaware'],
    },
    {
      letter: 'F',
      names: ['Florida'],
    },
    {
      letter: 'G',
      names: ['Georgia'],
    },
    {
      letter: 'H',
      names: ['Hawaii'],
    },
    {
      letter: 'I',
      names: ['Idaho', 'Illinois', 'Indiana', 'Iowa'],
    },
    {
      letter: 'K',
      names: ['Kansas', 'Kentucky'],
    },
    {
      letter: 'L',
      names: ['Louisiana'],
    },
    {
      letter: 'M',
      names: [
        'Maine',
        'Maryland',
        'Massachusetts',
        'Michigan',
        'Minnesota',
        'Mississippi',
        'Missouri',
        'Montana',
      ],
    },
    {
      letter: 'N',
      names: [
        'Nebraska',
        'Nevada',
        'New Hampshire',
        'New Jersey',
        'New Mexico',
        'New York',
        'North Carolina',
        'North Dakota',
      ],
    },
    {
      letter: 'O',
      names: ['Ohio', 'Oklahoma', 'Oregon'],
    },
    {
      letter: 'P',
      names: ['Pennsylvania'],
    },
    {
      letter: 'R',
      names: ['Rhode Island'],
    },
    {
      letter: 'S',
      names: ['South Carolina', 'South Dakota'],
    },
    {
      letter: 'T',
      names: ['Tennessee', 'Texas'],
    },
    {
      letter: 'U',
      names: ['Utah'],
    },
    {
      letter: 'V',
      names: ['Vermont', 'Virginia'],
    },
    {
      letter: 'W',
      names: ['Washington', 'West Virginia', 'Wisconsin', 'Wyoming'],
    },
  ];

  personalInformationStep: number | null = 0;

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
      productQualityComplaint: fb.control<boolean | null>(null, { nonNullable: true, validators: [Validators.requiredTrue] }),

      userType: fb.control<UserTypes>(UserTypes.Patient, { nonNullable: true, validators: [Validators.required] }),

      brand: fb.control<string>("", { nonNullable: true, validators: [Validators.required] }),
      lotNumber: fb.control<string>("", {})
    });

    const stateControl = fb.control<string>("", { nonNullable: true, validators: [Validators.required] });
    this.personalInformationFormGroup = fb.group<FormGroupType<IPersonalInformation>>({
      personalData: fb.group<FormGroupType<IPersonalData>>({
        firstName: fb.control<string>("", { nonNullable: true, validators: [Validators.required] }),
        lastName: fb.control<string>("", { nonNullable: true, validators: [Validators.required] }),

        birthdate: fb.control<DateTime>(DateTime.fromObject({ year: 1980, month: 1, day: 1 }), { nonNullable: true, validators: [Validators.required] }),

        sex: fb.control<string>("", { nonNullable: true, validators: [Validators.required] }),
        pregnant: fb.control<string>("", { nonNullable: false, validators: [] }),
      }),

      physicalAddress: fb.group<FormGroupType<IAddress>>({
        streetAddress: fb.control<string>("", { nonNullable: true, validators: [Validators.required] }),
        streetAddress2: fb.control<string>("", {}),
        city: fb.control<string>("", { nonNullable: true, validators: [Validators.required] }),
        state: stateControl,
        zipPostal: fb.control<string>("", { nonNullable: true, validators: [Validators.required] }),
      })
    });

    this.stateGroupOptions$ = stateControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterGroup(value || '')),
      takeUntil(this.destroy$)
    );

    this.problemSummaryFormGroup = fb.group<FormGroupType<IProblemSummary>>({
      issueVerbatim: fb.control<string>("", { nonNullable: true, validators: [Validators.required] }),
      images: fb.control<File[]>([], { nonNullable: true })
    });

    this.problemDetailsQuestionsFormGroup = fb.record({});
    this.problemDetailsFormGroup = fb.group<FormGroupType<IProblemDetailsWithDone>>({
      done: fb.control<boolean>(false, { nonNullable: true, validators: [Validators.requiredTrue] }),
      questions: this.problemDetailsQuestionsFormGroup as any,
      followUpOkay: fb.control<boolean>(false, { nonNullable: true })
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
          productQualityComplaint: null,
          userType: UserTypes.Patient,
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
        const personalInformation = this.personalInformationFormGroup.value;
        const problemSummary = this.problemSummaryFormGroup.value;
        const problemDetails = this.problemDetailsQuestionsFormGroup.value;

        const answeredQuestions: IQuestionsRequestAnswer[] = [];
        for (const question of this.problemDetailsQuestions) {
          const response = problemDetails[question.id];
          answeredQuestions.push({ questionId: question.id, response });
        }

        return {
          product: {
            productQualityComplaint: product.productQualityComplaint ?? null,
            userType: product.userType!,
            brand: product.brand!,
            lotNumber: product.lotNumber ?? null
          },
          userType: product.userType!,
          verbatim: problemSummary.issueVerbatim!,

          answeredQuestions
        };
      }),
      switchMap(c => this.questionsService.getNextQuestions(c)),
      takeUntil(this.destroy$)
    ).subscribe(resp => {
      if (resp.done) {
        this.problemDetailsFormGroup.controls.done.setValue(true);
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

  private _filterGroup(value: string): StateGroup[] {
    if (value) {
      return this.stateGroups
        .map(group => ({ letter: group.letter, names: _filter(group.names, value) }))
        .filter(group => group.names.length > 0);
    }

    return this.stateGroups;
  }

  get productQualityComplaint() {
    return this.productFormGroup.controls.productQualityComplaint.value;
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

  isExpansionStepInvalid(currentStep: number | null, step: number, formGroup: AbstractControl) {
    if (formGroup.valid || currentStep === step) {
      return false;
    }

    if (currentStep === null) {
      return true;
    }

    if (currentStep < step) {
      return formGroup.dirty;
    }

    return true;
  }

  private getNextQuestions() {
    this.readyForMoreQuestions$.next();
  }
}
