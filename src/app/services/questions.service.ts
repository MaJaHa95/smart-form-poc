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
    id: "how_experienced_simponi",
    type: "multiple-choice",
    required: true,
    questionText: "How experienced are you with Simponi?",
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
        name: "My healthcare provider showed me"
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

        nextQuestionId: "how_experienced_simponi"
      },
      {
        value: "Safety Sleeve",

        x: 440,
        y: 253,
        radius: 22,

        nextQuestionId: "how_experienced_simponi"
      },
      {
        value: "Tamper-Evident Seal",

        x: 545,
        y: 317,
        radius: 22,

        nextQuestionId: "how_experienced_simponi"
      },
      {
        value: "Large Viewing Window",

        x: 625,
        y: 250,
        radius: 22,

        nextQuestionId: "how_experienced_simponi"
      },
      {
        value: "Activation Button",

        x: 750,
        y: 236,
        radius: 22,

        nextQuestionId: "how_experienced_simponi"
      },
      {
        value: "Easy-to-Grip Shape",

        x: 927,
        y: 300,
        radius: 22,

        nextQuestionId: "how_experienced_simponi"
      },
      {
        value: "Expiration Date",

        x: 1055,
        y: 328,
        radius: 22,

        nextQuestionId: "how_experienced_simponi"
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
