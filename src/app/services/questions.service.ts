import { Injectable } from '@angular/core';
import { Observable, of } from "rxjs";
import { Question } from "../questions";
import { IProductInformation, UserTypes } from "../types";

export interface IQuestionsRequestAnswer {
  questionId: string;
  response: string;
}

export interface IQuestionsRequest {
  product: IProductInformation;

  userType: UserTypes;
  verbatim: string;

  answeredQuestions: IQuestionsRequestAnswer[];
}

export interface IQuestionsResponse {
  done: boolean;
  questions: Question[];
}


const allQuestions: Question[] = [{
  id: "how_experienced",
  type: "multiple-choice",
  required: true,
  questionText: "How experienced are you with Tremfya?",
  options: [
    {
      name: "This was my first time",
      nextQuestionId: "how_did_you_learn"
    },
    {
      name: "I'm somewhat experienced"
    },
    {
      name: "I've been using it for a long time"
    }
  ]
},
  {
    id: "how_did_you_learn",
    type: "multiple-choice",
    required: true,
    questionText: "How did you learn how to use the injector?",
    options: [
      {
        name: "My healthcare provider showed me",
        nextQuestionId: "field_sample_available",
      },
      {
        name: "I read the instructions"
      },
      {
        name: "I watched videos online"
      }
    ]
  },
  {
    id: "field_sample_available",
    type: "multiple-choice",
    required: true,
    questionText: "Field sample available?",
    options: [
      {
        name: "Initiate field sample return",
        nextQuestionId: "first_use_of_product"
      }
    ]
  },
  {
    id: "first_use_of_product",
    type: "multiple-choice",
    required: true,
    questionText: "Was this the first use of the product by the patient?",
    options: [
      {
        name: "Yes",
        nextQuestionId: "first_administration_HCP"
      },
      {
        name: "No",
        nextQuestionId: "first_administration_HCP"
      }
    ]
  },
  {
    id: "first_administration_HCP",
    type: "multiple-choice",
    required: true,
    questionText: "Was this the first administration given to a patient by this HCP?",
    options: [
      {
        name: "Yes",
        nextQuestionId: "product_Inspection"
      },
      {
        name: "No",
        nextQuestionId: "product_Inspection"
      }
    ]
  },
  {
    id: "product_Inspection",
    type: "multiple-choice",
    required: true,
    questionText: "Are Product Inspected",
    options: [
      {
        name: "Missing Components / Excess Components",
        nextQuestionId: "missing_components"
      },
      {
        name: "Damaged Components",
        nextQuestionId: "damaged_components"
      }
    ]
  },
  {
    id: "missing_components",
    type: "multiple-choice",
    required: true,
    questionText: "Upon opening the product, were any components missing from the package?",
    options: [
      {
        name: "Pre-filled Syringe",
        nextQuestionId: "extra_components"
      },
      {
        name: "Syringe Backstop",
        nextQuestionId: "extra_components"
      },
      {
        name: "Plunger Rod",
        nextQuestionId: "extra_components"
      },
      {
        name: "Tip Cap",
        nextQuestionId: "extra_components"
      }
    ]
  },
  {
    id: "extra_components",
    type: "multiple-choice",
    required: true,
    questionText: "Upon opening the product, were any extra components received in the package?",
    options: [
      {
        name: "Pre-filled Syringe",
        nextQuestionId: "blister_seals"
      },
      {
        name: "Syringe Backstop",
        nextQuestionId: "blister_seals"
      },
      {
        name: "Plunger Rod",
        nextQuestionId: "blister_seals"
      },
      {
        name: "Tip Cap",
        nextQuestionId: "blister_seals"
      }
    ]
  },
  {
    id: "blister_seals",
    type: "multiple-choice",
    required: true,
    questionText: "Upon opening the product, were any of the blister seals already opened?",
    options: [
      {
        name: "The kit tray containing the pre-filled syringe and needle blisters (sterile_breached)",
        nextQuestionId: "sterile_breached"
      },
      {
        name: " 1 ½” Thin Wall Needle (yellow) blister (sterile_breached)",
        nextQuestionId: "sterile_breached"
      }
    ]
  },
  {
    id: "sterile_breached",
    type: "multiple-choice",
    required: true,
    questionText: "Was a sterile barrier breached",
    options: [
      {
        name: "Customer unable/unwilling to answer",
        
      }
    ]
  },
  {
    id: "damaged_components",
    type: "multiple-choice",
    required: true,
    questionText: "Upon opening the product, were any components damaged?",
    options: [
      {
        name: "IFU Leaflet",
        nextQuestionId: "blister_seals"
      },
      {
        name: "Patient Insert",
        nextQuestionId: "blister_seals"
      }
    ]
  }
];

const allQuestionsMap = new Map(allQuestions.map(x => [x.id, x]));

const brandEntrypoints: Record<string, string> = {
  "Tremfya": "how_experienced",
  "Stelara": "how_experienced",
  "Simponi": "how_experienced"
};

@Injectable({
  providedIn: 'root'
})
export class QuestionsService {
  getNextQuestions(request: IQuestionsRequest): Observable<IQuestionsResponse> {
    if (request.answeredQuestions.length === 0) {
      const brandEntrypoint = brandEntrypoints[request.product.brand];

      if (brandEntrypoint) {
        return of({
          done: false,
          questions: [allQuestions[0]]
        });
      }
      else {
        console.error("No questions found for brand:", request.product.brand);

        return of({
          done: true,
          questions: []
        });
      }
    }

    const lastAnswer = request.answeredQuestions[request.answeredQuestions.length - 1];

    const lastQuestion = allQuestionsMap.get(lastAnswer.questionId);

    if (!lastQuestion) {
      return of({
        done: true,
        questions: []
      });
    }

    let nextQuestionId: string | undefined;

    switch (lastQuestion.type) {
      case "free-text": {
        nextQuestionId = lastQuestion.nextQuestionId;

        break;
      }
      case "multiple-choice": {
        nextQuestionId = lastQuestion.options.find(c => c.name === lastAnswer.response)?.nextQuestionId;

        break;
      }
    }

    const nextQuestion = nextQuestionId ? allQuestionsMap.get(nextQuestionId) : undefined;

    if (!nextQuestion) {
      return of({
        done: true,
        questions: []
      });
    }

    return of({
      done: false,
      questions: [nextQuestion]
    });
  }
}
