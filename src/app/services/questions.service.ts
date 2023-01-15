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


const allQuestions: Question[] = [
  {
    id: "how_experienced_tremfya",
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
    id: "who_administered",
    type: "multiple-choice",
    required: true,
    questionText: "Who was attempting to administer the dose?",
    options: [
      {
        name: "Myself",
        nextQuestionId: "first_administration_first_party"
      },
      {
        name: "A friend or family member",
        nextQuestionId: "first_administration_third_party"
      },
      {
        name: "A healthcare provider",
        nextQuestionId: "first_administration_third_party"
      }
    ]
  },
  {
    id: "first_administration_first_party",
    type: "multiple-choice",
    required: true,
    questionText: "How experienced are you with Simponi?",
    options: [
      {
        name: "This was my first time",
        nextQuestionId: "how_did_you_learn"
      },
      {
        name: "I'm somewhat experienced",
        nextQuestionId: "field_sample_available"
      },
      {
        name: "I've been using it for a long time",
        nextQuestionId: "field_sample_available"
      }
    ]
  },
  {
    id: "first_administration_third_party",
    type: "multiple-choice",
    required: true,
    questionText: "Have they administered this medication before?",
    options: [
      {
        name: "Yes",
        nextQuestionId: "field_sample_available"
      },
      {
        name: "No",
        nextQuestionId: "field_sample_available"
      },
      {
        name: "I don't know",
        nextQuestionId: "field_sample_available"
      }
    ]
  },
  {
    id: "field_sample_available",
    type: "multiple-choice",
    required: true,
    questionText: "If requested, would you be able to return the product using prepaid packaging?",
    options: [
      {
        name: "Yes"
      },
      {
        name: "No, it has been discarded"
      },
      {
        name: "No, I do not know where it is"
      },
      {
        name: "No, for another reason"
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
        name: "Yes",
        nextQuestionId: "sterile_breached"
      },
      {
        name: "No",
        nextQuestionId: "who_administered"
      }
    ]
  },
  {
    id: "sterile_breached",
    type: "multiple-choice",
    required: true,
    questionText: "Was a sterile barrier breached?",
    options: [
      {
        name: "Yes, for needles",
        nextQuestionId: "who_administered"
      },
      {
        name: "Yes, for kit blister",
        nextQuestionId: "who_administered"
      },
      {
        name: "No",
        nextQuestionId: "who_administered"
      },
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
        nextQuestionId: "field_sample_available"
      },
      {
        name: "I read the instructions",
        nextQuestionId: "field_sample_available"
      },
      {
        name: "I watched videos online",
        nextQuestionId: "field_sample_available"
      }
    ]
  },
  {
    id: "needle_damage_type",
    type: "multiple-choice",
    required: true,
    questionText: "What was the problem with the hidden needle?",
    options: [
      {
        name: "It got stuck in the injector",
        nextQuestionId: "who_administered"
      },
      {
        name: "It got stuck in my leg",
        nextQuestionId: "not_missed_dose"
      },
      {
        name: "Something else",
        nextQuestionId: "not_missed_dose"
      }
    ]
  },
  {
    id: "not_missed_dose",
    type: "multiple-choice",
    required: true,
    questionText: "To the best of your knowledge, was the dose administered despite the issue?",
    options: [
      {
        name: "Yes, completely",
        nextQuestionId: "who_administered"
      },
      {
        name: "Yes, partially",
        nextQuestionId: "who_administered"
      },
      {
        name: "No",
        nextQuestionId: "who_administered"
      },
      {
        name: "I'm not sure",
        nextQuestionId: "who_administered"
      }
    ]
  },
  {
    id: "simponi_device_failure_location",
    type: "image-map",
    required: true,
    questionText: "Where did the failure occur?",
    imageUrl: "https://www.simponihcp.com/sites/www.simponihcp.com/files/injection_experience_autoinjector_desktop_1.png",
    areas: [
      {
        value: "Hidden Needle",

        x: 394,
        y: 283,
        radius: 22,

        nextQuestionId: "needle_damage_type"
      },
      {
        value: "Safety Sleeve",

        x: 440,
        y: 253,
        radius: 22,

        nextQuestionId: "who_administered"
      },
      {
        value: "Tamper-Evident Seal",

        x: 545,
        y: 317,
        radius: 22,

        nextQuestionId: "blister_seals"
      },
      {
        value: "Large Viewing Window",

        x: 625,
        y: 250,
        radius: 22,

        nextQuestionId: "who_administered"
      },
      {
        value: "Activation Button",

        x: 750,
        y: 236,
        radius: 22,

        nextQuestionId: "who_administered"
      },
      {
        value: "Easy-to-Grip Shape",

        x: 927,
        y: 300,
        radius: 22,

        nextQuestionId: "who_administered"
      },
      {
        value: "Expiration Date",

        x: 1055,
        y: 328,
        radius: 22,

        nextQuestionId: "who_administered"
      }
    ]
  }
];

const allQuestionsMap = new Map(allQuestions.map(x => [x.id, x]));

const brandEntrypoints: Record<string, string> = {
  "Tremfya": "how_experienced_tremfya",
  "Stelara": "how_experienced_stelara",
  "Simponi": "simponi_device_failure_location"
};

@Injectable({
  providedIn: 'root'
})
export class QuestionsService {
  getNextQuestions(request: IQuestionsRequest): Observable<IQuestionsResponse> {
    if (request.answeredQuestions.length === 0) {
      const brandEntrypoint = allQuestionsMap.get(brandEntrypoints[request.product.brand]);

      if (brandEntrypoint) {
        return of({
          done: false,
          questions: [brandEntrypoint]
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
      case "image-map": {
        nextQuestionId = lastQuestion.areas.find(c => c.value === lastAnswer.response)?.nextQuestionId;

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
