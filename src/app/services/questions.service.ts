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
        name: "My healthcare provider showed me"
      },
      {
        name: "I read the instructions"
      },
      {
        name: "I watched videos online"
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
